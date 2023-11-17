<?php
header("Access-Control-Allow-Origin: *");

// Verificar si se recibió la ubicación desde la solicitud POST
if (isset($_POST['ubicacion'])) {
    // Obtener la ubicación desde la solicitud POST
    $ubicacion = $_POST['ubicacion'];

    // Registrar la ubicación en un archivo de registro
    $archivo_log = 'ubicacion.log';
    $registro = date('Y-m-d H:i:s') . ' - ' . $ubicacion . PHP_EOL;

    // Escribir en el archivo de registro (agregar al final)
    file_put_contents($archivo_log, $registro, FILE_APPEND);

    // Responder al cliente (puede ser útil para verificar en la consola del navegador)
    echo 'Ubicación recibida y registrada correctamente.';
} else {
    // Si no se recibió la ubicación, devolver un mensaje de error
    echo 'Error: No se recibió la ubicación.';
}

?>
