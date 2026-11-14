<?php

// Run locally after migrating the separate towertrack_public TiDB database.
// Only surveyed coordinates and the routes derived from them cross the boundary.

require dirname(__DIR__).'/vendor/autoload.php';

use App\Support\KecamatanSemarang;
use Dotenv\Dotenv;

$root = dirname(__DIR__);
$local = Dotenv::parse(preg_replace('/^\xEF\xBB\xBF/', '', file_get_contents($root.'/.env')));
$remote = Dotenv::parse(preg_replace('/^\xEF\xBB\xBF/', '', file_get_contents($root.'/.env.demo.local')));

function connect(array $env, string $database, bool $tls): PDO
{
    $options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
    if ($tls) {
        $options[PDO::MYSQL_ATTR_SSL_CA] = $env['MYSQL_ATTR_SSL_CA'];
    }

    return new PDO(
        "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$database};charset=utf8mb4",
        $env['DB_USERNAME'],
        $env['DB_PASSWORD'] ?? '',
        $options,
    );
}

function insert(PDO $pdo, string $table, array $row): void
{
    $columns = array_keys($row);
    $sql = 'INSERT INTO `'.$table.'` (`'.implode('`, `', $columns).'`) VALUES ('
        .implode(', ', array_fill(0, count($columns), '?')).')';
    $pdo->prepare($sql)->execute(array_values($row));
}

$source = connect($local, 'tagging_tower_kominfo', false);
$target = connect($remote, 'towertrack_public', true);

foreach (['towers', 'fo_points', 'fo_routes', 'users', 'reports', 'feedbacks'] as $table) {
    $count = (int) $target->query('SELECT COUNT(*) FROM `'.$table.'`')->fetchColumn();
    if ($count !== 0) {
        throw new RuntimeException("Target {$table} is not empty; refusing to overwrite staging data.");
    }
}

$now = date('Y-m-d H:i:s');
$towerCount = 0;
$pointCount = 0;
$routeCount = 0;
$pointIds = [];

$target->beginTransaction();
try {
    $towers = $source->query(
        'SELECT id, latitude, longitude FROM towers '
        .'WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND latitude <> 0 AND longitude <> 0 ORDER BY id'
    );
    while ($tower = $towers->fetch(PDO::FETCH_ASSOC)) {
        $lat = (float) $tower['latitude'];
        $lon = (float) $tower['longitude'];
        if (abs($lat) > 90 || abs($lon) > 180) {
            throw new RuntimeException('Invalid tower coordinate at source id '.$tower['id']);
        }
        $district = KecamatanSemarang::nearest($lat, $lon);
        insert($target, 'towers', [
            'id' => $tower['id'],
            'site_id' => 'MENARA-'.str_pad((string) $tower['id'], 3, '0', STR_PAD_LEFT),
            'site_name' => 'Menara '.str_pad((string) $tower['id'], 3, '0', STR_PAD_LEFT),
            'latitude' => $tower['latitude'],
            'longitude' => $tower['longitude'],
            'kecamatan' => $district,
            'alamat_menara' => 'Perkiraan Kecamatan '.$district.'; alamat jalan belum tersedia.',
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $towerCount++;
    }

    $points = $source->query(
        'SELECT id, sequence_number, latitude, longitude, route_name, area, type, status '
        .'FROM fo_points ORDER BY id'
    );
    while ($point = $points->fetch(PDO::FETCH_ASSOC)) {
        $lat = (float) $point['latitude'];
        $lon = (float) $point['longitude'];
        if (abs($lat) > 90 || abs($lon) > 180 || ($lat === 0.0 && $lon === 0.0)) {
            throw new RuntimeException('Invalid FO coordinate at source id '.$point['id']);
        }
        insert($target, 'fo_points', [
            'id' => $point['id'],
            'sequence_number' => $point['sequence_number'],
            'name' => 'Titik FO '.$point['id'],
            'latitude' => $point['latitude'],
            'longitude' => $point['longitude'],
            'route_name' => $point['route_name'],
            'area' => $point['area'],
            'description' => 'Perkiraan Kecamatan '.KecamatanSemarang::nearest($lat, $lon)
                .'; koordinat survei; alamat jalan belum tersedia.',
            'type' => $point['type'],
            'side_of_road' => 'unknown',
            'status' => $point['status'],
            'properties' => json_encode(['source' => 'survey_coordinates_public_demo']),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $pointIds[(int) $point['id']] = true;
        $pointCount++;
    }

    $routes = $source->query(
        'SELECT id, name, slug, area, description, path_coordinates, status, color, '
        .'total_distance, total_points, point_ids FROM fo_routes ORDER BY id'
    );
    while ($route = $routes->fetch(PDO::FETCH_ASSOC)) {
        $ids = json_decode($route['point_ids'] ?? '[]', true, 512, JSON_THROW_ON_ERROR);
        $coords = json_decode($route['path_coordinates'] ?? '[]', true, 512, JSON_THROW_ON_ERROR);
        if (count($ids) < 2 || count($coords) < 2 || count(array_diff($ids, array_keys($pointIds))) > 0) {
            throw new RuntimeException('Incomplete FO route at source id '.$route['id']);
        }
        insert($target, 'fo_routes', [
            'id' => $route['id'],
            'name' => $route['name'],
            'slug' => $route['slug'],
            'area' => $route['area'],
            'description' => $route['description'],
            'path_coordinates' => $route['path_coordinates'],
            'status' => $route['status'],
            'color' => $route['color'],
            'total_distance' => $route['total_distance'],
            'total_points' => $route['total_points'],
            'point_ids' => $route['point_ids'],
            'properties' => json_encode(['source' => 'survey_coordinates_public_demo']),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $routeCount++;
    }

    if ($towerCount !== 117 || $pointCount !== 203 || $routeCount !== 17) {
        throw new RuntimeException("Source row counts changed: {$towerCount}/{$pointCount}/{$routeCount}.");
    }
    $target->commit();
} catch (Throwable $e) {
    $target->rollBack();
    throw $e;
}

echo "Imported {$towerCount} tower locations, {$pointCount} FO points, {$routeCount} routes; no accounts, messages, media, or operator assignments.\n";
