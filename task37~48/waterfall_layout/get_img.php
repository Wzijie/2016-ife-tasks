
<?php 
	
	if(!empty($_POST)){
		$dir = $_POST['dir'];
		$file = scandir($dir);
		
		echo json_encode($file);
	}
	
	// var_dump($_POST);

 ?>
