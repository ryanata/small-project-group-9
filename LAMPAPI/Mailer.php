<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;
  require '../PHPMailer/src/Exception.php';
  require '../PHPMailer/src/PHPMailer.php';
  require '../PHPMailer/src/SMTP.php';

  $mail = new PHPMailer();
  $mail->IsSMTP();
  $inData = getRequestInfo();
  
  $mail->SMTPDebug  = 0;  
  $mail->SMTPAuth   = TRUE;
  $mail->SMTPSecure = "tls";
  $mail->Port       = 587;
  $mail->Host       = "smtp.gmail.com";
  $mail->Username   = "smallproject9cop@gmail.com";
  $mail->Password   = "ophnysvypxnasbbc";

  $mail->IsHTML(true);
  $mail->AddAddress($inData["email"], "recipient-name");
  $mail->SetFrom("smallproject9cop@gmail.com", "test");
  $mail->Subject = "Test is Test Email sent via Gmail SMTP Server using PHP Mailer";
  $content = "<b>This is a Test Email sent via Gmail SMTP Server using PHP mailer class.</b>";

  $mail->MsgHTML($content); 
  if(!$mail->Send()) {
    echo "Error while sending Email.";
    var_dump($mail);
  } else {
    echo "Email sent successfully";
  }
  
  
  	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
?>

