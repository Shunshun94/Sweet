QUnit.test('map', function(assert) {
	var $map = $('#map');
	var done = assert.async();
	var map = {};
	var ranges = '1,2,3,4,5,6,7,8,9';
	
	$map.on('tofRoomRequest', function(e){
		e.resolve(sampleMapData);
		assert.equal(
			$map.find('.com-hiyoko-dodontof-map-object-characterData').length,
			sampleMapData.characters.filter(function(v){return v.type === 'characterData'}).length,
			'All Characters added collectlly'
		);
		
		$map.find('.com-hiyoko-dodontof-map-object-characterData').css({
			zIndex:6, border: '3px yellow outset'
		});
	});
	map = new com.hiyoko.sweet.MapOrganizer.Map($map, {range: 'circle',scale: 3, size: 30, distances: ranges});
	assert.ok(map.$base === null, 'Range mode is not started');
	assert.equal(map.scale, 3, 'map.scale is collected');
	assert.equal(map.size, 30, 'map.size is collected');
	setTimeout(function(){
		$($('.com-hiyoko-dodontof-map-object-characterData')[1]).trigger(new $.Event('click'));
		assert.ok(map.$base, 'Range mode is started');
		assert.equal(
				$map.find('.map-rangeCircle').length, ranges.split(',').length,
				'Range circle is added collectly'
		);
		done();
	}, 300);
});