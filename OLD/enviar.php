<?php

$name 		= $_POST["name"];
$email 		= $_POST["email"];
$comments 	= $_POST["comments"];

$cabecera = "Content-type: text/html\r\n";
		
		// Additional headers
		$cabecera .= 'From: Contacto de Urucas <info@urucas.com>' . "\r\n";

		$mailContent = '<html>
<head>
<title>Urucas</title>
</head>
<body>
	<div style="width:700px;height:395px;background:#E6E6E6 url(http://www.urucas.com/images/cartel.png)">
		<div >
			<img style="margin:100px 0 6px 100px;" src="http://www.urucas.com/images/footer-logo.png" />
		</div>
		<div style="width:500px;height:220px;background-color:white;border-radius:15px;margin-left:90px;padding:20px;font-family:\'Arial\';font-size:12pt;color:#fff;">
			<p>Mensaje de <b>'.$name.'</b></p>

			<p>Email: '.$email.'</p>

			<p>Comentarios: '.$comments.'</p>
		</div>
	</div>
</body>
</html>';
	

		mail("pamepros@gmail.com,brunotrs@gmail.com","Urucas Form",$mailContent,$cabecera);
die(json_encode(array("msg"=>"We got your message, we'll stay in touch!")));



?>
