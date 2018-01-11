<?php
ini_set("display_errors", "1");
error_reporting(E_ALL);


// const AGE = 1;
// define('GROUP', 2);

// echo GROUP;
// class WordCounter
// {
// const ASC=1; //you need not use $ sign before Constants
// const DESC=2;

// private $words;
// function __construct($filename)
// {
// $file_content = file_get_contents($filename);
// $this->words = (array_count_values(str_word_count(strtolower ($file_content),1)));
// }
// public function count($order)
// {
    
// if ($order==self::ASC)
// asort($this->words);
// else if($order==self::DESC)
// arsort($this->words);
// foreach ($this->words as $key=>$val)
// echo $key ." = ". $val."<br/>";
// }
// }

// $wc = new WordCounter("words.txt");
// $wc->count(WordCounter::DESC);


//class.statictester.php
// class StaticTester
// {
//     private static $id=0;
//     function __construct()
//     {
//      self::$id +=1;
//     }
//     public static function checkIdFromStaticMehod()
//     {
//         echo "Current Id From Static Method is ".self::$id."<br>";
//     }
//     public function checkIdFromNonStaticMethod()
//     {
//         echo "Current Id From Non Static Method is ".self::$id."<br>";
//     }
// }
// $st1 = new StaticTester();
// StaticTester::checkIdFromStaticMehod();
// $st2 = new StaticTester();
// $st1->checkIdFromNonStaticMethod(); 
// $st1->checkIdFromStaticMehod();
// $st2->checkIdFromNonStaticMethod();
// $st3 = new StaticTester();
// StaticTester::checkIdFromStaticMehod();

// class EmailValidator
// {
// public $emails;
// public $validemails;
// }
// $ev = new EmailValidator();
// foreach($ev as $key=>$val)
// {
// echo $key."<br/>";
// }

// class SampleObject
// {
// public $var1;
// private $var2;
// protected $var3;
// public static $var4;
// private $staticvars = array();
// public function __construct()
// {
// $this->var1 = "Value One";
// $this->var2 = "Value Two";
// $this->var3 = "Value Three";
// SampleObject::$var4 = "Value Four";
// }
// public function __sleep()
// {
// $vars = get_class_vars(get_class($this));
// foreach($vars as $key=>$val)
// {
// if (!empty($val))
// $this->staticvars[$key]=$val;
// }
// return array_keys( get_object_vars( $this ) );
// }
// public function __wakeup()
// {
// foreach ($this->staticvars as $key=>$val){
// $prop = new ReflectionProperty(get_class($this), $key);
// $prop->setValue(get_class($this), $val);
// }
// $this->staticvars=array();
// }
// }
// print_r(new SampleObject());

// class Emailer
// {
// 	private $sender;
// 	private $recipients;
// 	private $subject;
// 	private $body;
// 	function __construct($sender)
// 	 {
// 		$this->sender = $sender;
// 		$this->recipients = array();
// 	 }
// 	public function addRecipients($recipient)
// 	 {
// 		array_push($this->recipients, $recipient);
// 	 }
// 	public function setSubject($subject)
// 	 {
// 		$this->subject = $subject;
// 	 }
// 	public function setBody($body)
// 	 {
// 		$this->body = $body;
// 	 }
// 	public function sendEmail()
// 	 {
//         //print_r($this->recipients);

// 	  foreach ($this->recipients as $recipient)
// 	   {
// 		$result = mail($recipient, $this->subject, $this->body,"From: {$this->sender}\r\n");
// 		echo "Mail successfully sent to {$recipient}<br/>";
// 	   }
// 	 }
// }

// $email = new Emailer('helllo@ucreate.co.in');
// $email->setSubject('test');
// $email->setBody('test');
// $email->addRecipients('test@yopmail.com');
// $email->sendEmail();

// class A
// {
//     static $a =10;
// 	public static  function hello()
// 	 {
//         echo SELF::$a;
//      }
// }
// $a = new A;
// $a::hello();
// //$a->hello();
// class Base {
//     public function sayHello() {
//         echo 'Hello ';
//     }
// }

// trait SayWorld {
//     public function sayHello() {
//         parent::sayHello();
//         echo 'World!';
//     }
// }

// class MyHelloWorld extends Base {
//     use SayWorld;
// }

// $o = new MyHelloWorld();
// $o->sayHello();

// trait A
// {
//     public function sayHello() 
//     {
//         echo 'Hello ';
//     }
// }

// trait B
//  {
//     public function sayHello()
//      {
//         echo 'World!';
//     }
// }

// class MyHelloWorld 
// {
//     use A,B;

// }

// $o = new MyHelloWorld();
// $o->sayHello();

interface hello {
    function m1();
    function m2();
    function m3();
  }
  abstract class AbstractThing implements hello {
    public function m1() { return 'i am m1';}
    public function m3() { return 'i am m3';}
  }
echo 'a';