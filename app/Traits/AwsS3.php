<?php
namespace App\Traits;
use Storage;

trait AwsS3 {

	public function signed_url($url, $mime_type, $expiry = "+10 minutes"){
		$s3 = Storage::disk('s3');
		$client = $s3->getDriver()->getAdapter()->getClient();
		$command = $client->getCommand('GetObject', [
			'Bucket' => getenv("S3_BUCKET_NAME"),
			'Key'    => $url
		]);    
		$response = $client->createPresignedRequest($command, $expiry);
		return (string) $response->getUri();
	}
}