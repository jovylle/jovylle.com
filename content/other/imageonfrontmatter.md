---
title: 'Title of the page'
description: 'meta description of the page'
image: '/image-1.png'
---


{{$doc.image}} <!-- here just to test if I can get the variable -->

![{{$doc.image}}]({{$doc.image}}) <!-- unexpectedly not worked -->

<img src="{{ $doc.image }}" alt="image" /> <!--  not worked either -->
