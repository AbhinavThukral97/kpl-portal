$(document).ready(function(){
	var line1 = '<div class="card"><img src="img/';
	var line2 = '"><p>';
	var line3 = '</p></div>';

	function refreshGallery(cat){
		$('.gallery').css('opacity','0');
		setTimeout(function(){
			$('.gallery').html('');
			for(let i=0;i<data.length;i++){
				if(data[i][2]==cat){
					$('.gallery').append(line1 + data[i][0] + line2 + data[i][1] + line3);
				}
			}
		},500);
		setTimeout(function(){
			$('.gallery').css('opacity','1');
		},1000);
	}

	$('.tab').click(function(){
		$('.tab').removeClass('active');
		$(this).addClass('active');
		refreshGallery($(this).text());
	});

	refreshGallery('Pre-Learning');
});