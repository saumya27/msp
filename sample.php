<?php
  echo json_encode(array(
    "stores" => array(
      array(
        "id" => "TMS-HYD-001",
        "name" => "The MobileStore",
        "address" => "Plot No 20, Door No 1-9-2/G/1, SAI Siddharatha Complex, Near Image Hospital, Hitech City Main Road, Madhapur, Hyderabad - 500081",
        "phone" => 9876543210,
        "logo" => "http://b7002b41b24df693b1d7-3fce2a06e03172c5e2e045b2102b8526.r18.cf1.rackcdn.com/tms.png",
        "price" => 8699,
        "shipping" => array(
          "pickup" => TRUE,
          "delivery" => TRUE
        )
      )
    )
  ));
?>