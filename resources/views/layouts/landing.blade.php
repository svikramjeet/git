<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Title goes here</title>
  <meta name="description" content="Description of your site goes here">
  <meta name="keywords" content="keyword1, keyword2, keyword3">
  <link href="{{ url('css/style.css') }}" rel="stylesheet" type="text/css">
   
</head>
<body>
<div class="main">
<div class="page-out">
<div class="page">
<div class="header">
<div class="header-top">

</div>
<div class="header-img"><img src="{{ url('images/header.jpg') }}" alt="" height="225" width="899"></div>
</div>
<div class="content">
<div class="left-out">
<div class="left-in">
<div class="left-panel">
<h1>@yield('pagetitle')</h1>
<p>&nbsp;</p>
<p><h2>Welcome user</h2>
<p>&nbsp;</p>
@yield('pagecontent')
</p>
</div>
</div>
</div>
<div class="right-out">
<div class="right-in">
<div class="right-panel">
<div class="right-block">
<h2>Categories</h2>
<ul>
  <li><a href="{{ url('/user') }}">Home</a></li>
  <li><a href="{{ url('/user/create') }}">Add</a></li>
  <li><a href="{{ url('/user/list') }}">List</a></li>
   
</ul>
</div>
</div>
</div>
</div>
</div>
<div class="footer">
<div class="footer-left">
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</div>
<div class="footer-right">
<p>&copy; Copyright 2017.</p>
</p>
</div>
</div>
</div>
</div>
</div>


</body></html>