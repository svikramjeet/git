<?php
namespace App\Traits;

trait FileHandling {

	public function read_file($file=null) {
		return $this->read_csv($file);
	}


	protected function read_csv($file){
		$file = fopen($file,"r");
		$all_rows = array();
		$header = null;
		while ($row = fgetcsv($file)) {
			$row = array_map("utf8_encode", $row);
		    if ($header === null) {
		        $header = $row;
		        continue;
		    }
		    $all_rows[] = array_combine($header, $row);
		}
		fclose($file);
		return $all_rows;
	}
}