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
  # Email sent via Gmail SMTP Server using PHP Mailer
  $mail->Subject = "Welcome to mihoyminoy!";
  $content = "
              <!DOCTYPE html>
              <html>
                <body>

                      <style>
                        html * {
                          font-family: Verdana;
                        text-align: center;
                        }
                      </style>
                      
                      <h1>mehoyminoy</h1>
                      <p>Hello,</p>
                      <p>Thank you for joining mehoyminoy, the free browser-based contact manager! We hope you enjoy your stay!</p>
                      <p>Best,<br>The mehoyminoy team</p>

                </body>
              </html>
            ";

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

