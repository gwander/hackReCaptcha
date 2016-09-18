<?php

$imageUrl = $_POST["imageUrl"];

$content = file_get_contents($imageUrl);

$imageName = "tempImage";
$url = "temp/tempImage.png";
$fp = fopen($url, "w");
fwrite($fp, $content);
fclose($fp);

echo json_encode([ "url" => $url ]);

?>