

QUnit.test('map', function(assert) {
	var $map = $('#map');
	var done = assert.async();
	var map = {};
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
	map = new com.hiyoko.sweet.MapOrganizer.Map($map, {range: 'circle',scale: 3, size: 30});
	assert.ok(map.$base === null, 'Range mode is not started');
	assert.equal(map.scale, 3, 'map.scale is collected');
	assert.equal(map.size, 30, 'map.size is collected');
	setTimeout(function(){
		$($('.com-hiyoko-dodontof-map-object-characterData')[1]).trigger(new $.Event('click'));
		assert.ok(map.$base, 'Range mode is started');
		assert.ok(
				$map.find('.map-rangeCircle').length > 0,
				'Range circle is added'
		);
		done();
	}, 300);
});