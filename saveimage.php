<?php

$imageUrl = $_POST["imageUrl"];
$temp = $imageUrl.'&x='.mt_rand();
$content = file_get_contents($temp);

$imageName = "tempImage";
$url = "temp/tempImage.png";
$fp = fopen($url, "w");
fwrite($fp, $content);
fclose($fp);

echo json_encode([ "url" => $url.'?c='.mt_rand(), 'ask' =>  $temp ]);

?>