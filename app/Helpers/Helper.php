<?php

use App\User;
use App\Helpers\Aws;

function getFavicon($url){
  return 'https://www.google.com/s2/favicons?domain='.$url;
}

function generateImageThumbnail($source_image_path, $width, $height) {
    makeAWSFilePublic($source_image_path);
    list($source_image_width, $source_image_height, $source_image_type) = getimagesize($source_image_path);
    switch ($source_image_type) {
        case IMAGETYPE_GIF:
            $source_gd_image = imagecreatefromgif($source_image_path);
            break;
        case IMAGETYPE_JPEG:
            $source_gd_image = imagecreatefromjpeg($source_image_path);
            break;
        case IMAGETYPE_PNG:
            $source_gd_image = imagecreatefrompng($source_image_path);
            break;
    }
    if ($source_gd_image === false) {
      return 'width='.$width.' height='.$height;
    }
    $source_aspect_ratio = $source_image_width / $source_image_height;
    $thumbnail_aspect_ratio = $width/$height;
    if ($source_image_width <= $width && $source_image_height <= $height) {
      $thumbnail_image_width = $source_image_width;
      $thumbnail_image_height = $source_image_height;
    } elseif ($thumbnail_aspect_ratio > $source_aspect_ratio) {
      $thumbnail_image_width = (int) ($height * $source_aspect_ratio);
      $thumbnail_image_height = $height;
    } else {
      $thumbnail_image_width = $width;
      $thumbnail_image_height = (int) ($width / $source_aspect_ratio);
    }
    return 'width='.$thumbnail_image_width.' height='.$thumbnail_image_height;
}

function fileIcon($file_name){
  $file_name = explode('.', $file_name);
  return env('APP_URL').config('constants.extension_wise_png_image.'.strtolower(array_pop($file_name)));
}

function makeAWSFilePublic($url){
  (new AWS)->change_visibility($url, 'public');
  return $url;
}

function anyImage($search_array) {
  $found = 0;
  foreach ($search_array as $key => $row) {
      if(is_numeric(stripos($row['metadata']['mimeType'], 'image')))
        $found++;
  }
  return $found;
}

function checkSeeMoreEligiblity($comment){
  return (substr_count($comment, '<br>') > 2 || strlen(strip_tags($comment))>config('constants.post_comment_string_limit'));
}

function formatCommentText(string $comment_text) {
  
    $regex_for_link = array('`((?:https?|ftp)://\S+[[:alnum:]]/?)`si','`((?<!//)(www\.\S+[[:alnum:]]/?))`si'); 
    $regex_replacement = array('<a class="post_emb_link" href="$1" target="_blank">$1</a>', '<a class="post_emb_link" href="http://$1" target="_blank">$1</a>');

    $comment_after_process = str_replace('</div>', '', trim($comment_text));
    $comment_after_process = str_replace('<div>', ' <br>', $comment_after_process);
    $comment_after_process = str_replace('<br>', ' <br>', $comment_after_process);
    $comment_after_process = strip_tags(trim($comment_after_process), '<a><br>');
    
    $comment_after_process = preg_replace($regex_for_link, $regex_replacement, $comment_after_process);
    return ['comment_after_process'=>$comment_after_process, 'raw_comment' => $comment_text];
}

function removeSpecialCharacters(string $string) {
   $string = str_replace(' ', '-', $string);
   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

function linkToTest(string $string, string $link, string $link_wrap='see more') {
  $regex = config('constants.email.regex');
  $link_html = "<a href='$link'>$link_wrap</a>";
  return preg_replace($regex, $link_html, $string);
}

function getPostThumbnailUrl( $url, $domain ){
  if(!$url) return $domain.'/favicon.ico';
  if(is_numeric(strpos($url, 'https://'))) return $url;
  else return env('APP_URL').'/file_loading?url='.$url;
}

function linkMentionUser($message){
  return $message; //this is temp changes for production will revert back after production push, please ignore while code reviewing. Thanks
  $users = implode("%','", regExtract($message, config('constants.email.mention'))[0]);
  $user_list = str_replace('@', '', $users);

  $user_list = User::taggedUsers($user_list);

  foreach ($user_list as $user ) {
    $user['fullname'] = "<a data-id='".$user['id']."'onclick='liked_info(this);'>".$user['fullname']."</a>";
    $message = str_replace($user['username'], ucfirst($user['fullname']), $message);
  }
  return $message;
}

function regExtract($string, $regex) {
  preg_match_all($regex, $string, $match, false);
  return $match;
}

function show($variable){
  print_r($variable); die();
}