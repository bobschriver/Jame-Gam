function game_board_get(x , y)
{
	if(x >= 0  && x <= num_box_width - 1 && y >= 0 && y <= num_box_height - 1)
	{
		return game_board_arr[x][y]
	}

	return null
}

function game_board_set(x , y , value)
{
	if(x >= 0 && x <= num_box_width - 1 && y >= 0 && y <= num_box_height -1)
	{
		game_board_arr[x][y] = value
	}
}

function init()
{
	min_music_makers = 10
	max_music_makers = 30

	box_width_padding = 1
	box_height_padding = 1

	box_width = 18
	box_height = 18

	num_box_width = 60
	num_box_height = 30

	viewport = false

	game_board_width = box_width * num_box_width + box_width_padding * num_box_width
	game_board_height = box_height * num_box_height + box_height_padding * num_box_height

	initialize_game_board()
	
	var player_x_location = Math.floor(Math.random() * num_box_width)
	var player_y_location = Math.floor(Math.random() * num_box_height)


	initialize_audio()
	
	start_game_with_player(player_x_location , player_y_location)

	update()

	document.addEventListener('keydown' , function(event) {

		if(event.keyCode == 37)
		{
			//Left
			p.x_direction = -1
			p.x_velocity = 1
		}
		else if(event.keyCode == 38)
		{
			//up
			p.y_direction = -1
			p.y_velocity = 1
		}
		else if(event.keyCode == 39)
		{
			//right
			p.x_direction = 1
			p.x_velocity = 1
		}
		else if(event.keyCode == 40)
		{
			//down
			//
			p.y_direction = 1
			p.y_velocity = 1
		}

		if(event.keyCode == 187)
		{
			if(interval < 8)
			{
				interval += 1
			}

		}
		else if(event.keyCode == 189)
		{
			if(interval > 1)
			{
				interval -= 1
			}
		}

		if(event.keyCode == 86)
		{
			viewport = !viewport
		}
	});

}

function start_game_with_player(player_x_location , player_y_location)
{
	num_music_makers = Math.random() * (max_music_makers - min_music_makers) + min_music_makers

	start_game(num_music_makers , player_x_location , player_y_location)
}

function start_game(num_music_makers , player_x_location , player_y_location)
{
	initialize_actors()
	initialize_game_board_arr()

	curr_time = 0

	initialize_player(player_x_location , player_y_location)
	initialize_music_makers(num_music_makers)

	interval = 4

	
}

function initialize_music_makers(num)
{
	//var tones = [60 , 120 , 180 , 240 ,300 , 320 ,  360 , 380 , 400 , 420 , 440 , 460 ,  480 , 540 ,  600]
	var tones = [65 , 74 , 83 , 98 , 110 , 130 , 147 , 165 , 196 , 220 , 261 , 293 , 329 , 392 , 440 , 522 , 586 , 658 , 684 , 880 , 1033 , 1172 , 1316 , 1468 , 1760]
	//var tones = [164 , 185 , 207 , 246 , 277 , 329 , 369 , 415 , 493 , 554 , 658 , 738 , 830 , 986]
	//var tones = [146 , 164 , 185 , 220 , 246 , 293 , 329 , 369 , 440]

	var color_choices = [75 , 100 , 125 , 150 , 175]
	var frequencies = [4 , 6 , 12 , 16 , 18 , 20 , 24]

	for(var i = 0; i < num; i++)
	{
		//var tone_index = Math.floor(random_normal_min_max(12 , 4 , 0 , 24))
		var tone_index = Math.floor(Math.random() * tones.length)
		var tone = tones[tone_index]
		
		var color_index = Math.floor(tone_index * (color_choices.length / tones.length))

		var r_random = Math.random()
		var r_index = r_random < 0.25 ? color_index - 1 : r_random > 0.75 ? color_index + 1 : color_index
		r_index = Math.min(Math.max(0 , r_index) , color_choices.length)
		var color_r = color_choices[r_index]
		
		var g_random = Math.random()
		var g_index = g_random < 0.25 ? color_index - 1 : g_random > 0.75 ? color_index + 1 : color_index
		g_index = Math.min(Math.max(0 , g_index) , color_choices.length)
		var color_g = color_choices[g_index]

		var b_random = Math.random()
		var b_index = b_random < 0.25 ? color_index - 1 : b_random > 0.75 ? color_index + 1 : color_index
		b_index = Math.min(Math.max(0 , b_index) , color_choices.length)
		var color_b = color_choices[b_index]
	

		//var frequency_index = Math.floor(random_normal_min_max(6 , 2 , 0 , 10))
		var frequency_index = Math.floor(Math.random() * frequencies.length)
		var frequency = frequencies[frequency_index]

		var x_location = Math.floor(Math.random() * num_box_width)
		var y_location = Math.floor(Math.random() * num_box_height)

		var music = new music_maker( x_location , y_location , frequency , tone , [color_r , color_g , color_b])

		actors.push(music)
	}
}

function initialize_player(player_x_location , player_y_location)
{
	p = new player(player_x_location , player_y_location , 0 , 0 , 0 , 0 , [0 , 0, 0])
	actors.push(p)
}

function initialize_audio()
{
	audio_context = new webkitAudioContext()
}

function play_noise(tone , intensity , channel)
{
	var noise = audio_context.createBufferSource()

	var noise_length = 1800000 / tone 
	noise_length = Math.round(noise_length / 1024) * 1024
	
	//var noise_length = 4096

	var audio_buffer = audio_context.createBuffer(2 , noise_length , (44100))

	var buf = audio_buffer.getChannelData(channel)
	for(i = 0; i < audio_buffer.length; i ++)
	{		
		buf[i] = Math.cos(tone * Math.PI * 2 * i / (44100))
	}


	noise.buffer = audio_buffer

	var gain_node = audio_context.createGain()

	if(intensity > 24)
	{
		intensity = 24
	}

	gain_node.gain.value = intensity / 6.0
	noise.connect(gain_node)
	gain_node.connect(audio_context.destination)
	noise.start(audio_context.currentTime)
}

function initialize_game_board_arr()
{
	game_board_arr = new Array(num_box_width)
	for(var i = 0; i < num_box_width; i ++)
	{
		game_board_arr[i] = new Array(num_box_height)
	}

}

function initialize_actors()
{
	actors = new Array()
}

function update()
{
	curr_time += 1
	
	update_actors()
	update_board()

	setTimeout("update()" , 120)
}

function update_actors()
{
	var actor_length = actors.length
	for(var i = 0; i < actor_length; i ++)
	{
		if(i > actors.length)
		{
			break;
		}
		if(actors[i] != null)
		{
			actors[i].move(curr_time)
		}

	}
}

function clear_board()
{
	for(var i = 0; i < num_box_width; i ++)
	{
		for(var j = 0; j < num_box_height; j++)
		{
			game_board_arr[i][j] = null
		}
	}
}

function distance(p1_x , p1_y , p2_x , p2_y)
{
	var a = Math.pow(Math.max(p1_x , p2_x) - Math.min(p1_x , p2_x) , 2)
	var b = Math.pow(Math.max(p1_y , p2_y) - Math.min(p1_y , p2_y) , 2)
	
	return Math.floor(Math.sqrt(a + b))
}

function update_board()
{
	clear_board()

	for(var i = 0; i < actors.length; i++)
		{
			if(actors[i] instanceof music_note)
			{
				if(actors[i].intensity <= 0)
				{
					actors.splice(i , 1)
				}
			}
		}

	var to_remove = new Array()
	for(var i = 0; i < actors.length; i++)
	{
		var curr_x_index = actors[i].x_index
		var curr_y_index = actors[i].y_index


		if(curr_x_index > num_box_width - 1 || curr_y_index > num_box_height - 1 || curr_x_index < 0 || curr_y_index < 0)
		{
			to_remove.push(actors[i])
			continue
		}

		if(game_board_arr[curr_x_index][curr_y_index] == null || game_board_arr[curr_x_index][curr_y_index] == actors[i])
		{
			

			game_board_arr[curr_x_index][curr_y_index] = actors[i]
		}	
		else
		{
			var dest_actor = game_board_arr[curr_x_index][curr_y_index]
			var src_actor = actors[i]
		
				

			if(src_actor instanceof music_note)
			{
				if(src_actor.intensity <= 0)
				{
					to_remove.push(src_actor)
				}
				else if(dest_actor instanceof music_note)
				{
					
					//var tone = Math.floor((src_actor.tone + dest_actor.tone) / 2)
					var tone = src_actor.tone
					
					//var player_distance = Math.abs(p.x_index - src_actor.x_index) + Math.abs(p.y_index - src_actor.y_index)
					var player_distance = distance(p.x_index , p.y_index , src_actor.x_index , src_actor.y_index)

					var intensity = (dest_actor.intensity + src_actor.intensity) / (player_distance * 3)
					
					intensity = Math.min(intensity , 12)

					var channel = dest_actor.x_index < p.x_index ? 0 : 1
					
					play_noise(tone , intensity , channel)
					
					game_board_arr[curr_x_index][curr_y_index] = null
					to_remove.push(src_actor)

					to_remove.push(dest_actor)
				
				}
				else if(dest_actor instanceof player)
				{
					var tone = src_actor.tone
					var intensity = src_actor.intensity - 1
	
					var channel = src_actor.x_direction >= 0 ? 0 : 1
					//play_noise(tone , intensity , channel)

					to_remove.push(src_actor)
				}
				else if(dest_actor instanceof music_maker)
				{
					src_actor.x_direction *= -1
					src_actor.y_direction *= -1
					
					//Remove and re-add
					//next_valid = gen_next_valid(curr_x_index , curr_y_index , src_actor.x_direction , src_actor.y_direction , src_actor.x_velocity , src_actor.y_velocity)
				//	src_actor.x_index = next_valid[0]		
				//	src_actor.y_index = next_valid[1]	
				//	to_remove(i)
				//	actors.push(src_actor)
				}
			}
			else if (src_actor instanceof player)
			{
				if(dest_actor instanceof music_note)
				{
					var tone = dest_actor.tone
					var intensity = dest_actor.intensity - 1
	
					var channel = dest_actor.x_direction >= 0 ? 0 : 1
					play_noise(tone , intensity , channel)

					game_board_arr[curr_x_index][curr_y_index] = src_actor
					to_remove.push(dest_actor)
				}
				else if(dest_actor instanceof music_maker)
				{
					next_valid = gen_next_valid(curr_x_index , curr_y_index , src_actor.x_direction , src_actor.y_direction , src_actor.x_velocity , src_actor.y_velocity)

					dest_actor.x_index = next_valid[0]
					dest_actor.y_index = next_valid[1]
							
						//remove it , redo the collision
					actors.splice(actors.indexOf(dest_actor) , 1)
					actors.push(dest_actor)

				}

				
			}
			else if (src_actor instanceof music_maker)
			{
				if(dest_actor instanceof music_note)
				{
					game_board_arr[curr_x_index][curr_y_index] = src_actor
			
				}
				else if(dest_actor instanceof player)
				{
					next_valid = gen_next_valid(curr_x_index , curr_y_index , dest_actor.x_direction , dest_actor.y_direction , dest_actor.x_velocity , dest_actor.y_velocity)

					if(next_valid[0] != curr_x_index || next_valid[1] != curr_y_index)
					{
						src_actor.x_index = next_valid[0]
						src_actor.y_index = next_valid[1]
							
						//remove it , redo the collision
						to_remove.push(src_actor)
						actors.push(src_actor)
					}
				}
			}
		}	
	}

	p.x_velocity = 0
	p.y_velocity = 0

	p.x_direction = 0
	p.y_direction = 0

	for(var i = 0; i < to_remove.length; i++)
	{
		actors.splice(actors.indexOf(to_remove[i]) , 1)
	}

	to_remove.length = 0

	for(var i = 0; i < num_box_width; i ++)
	{
		for(var j = 0; j < num_box_height; j ++)
		{

			
			var player_distance = Math.abs(p.x_index - i) + Math.abs(p.y_index - j)

			if(!viewport)
			{
				var d = Math.pow(distance(p.x_index , p.y_index , i , j) , 2)
			}
			else
			{
				var d = 0
			}

			if(game_board_arr[i][j] != null)
			{
				var next_x_start_x_index = i * (box_width + box_width_padding)
	
				var next_y_start_y_index = j * (box_height + box_height_padding)
			

				var r = Math.min(game_board_arr[i][j].color[0] + d , 225)
				var g = Math.min(game_board_arr[i][j].color[1] + d , 225)
				var b = Math.min(game_board_arr[i][j].color[2] + d , 225)

				game_board_context.fillStyle = "rgb(" + r + "," + g + "," + b + ")"
				game_board_context.fillRect(next_x_start_x_index , next_y_start_y_index , box_width , box_height)
				
				/*if(game_board_arr[i][j] instanceof player)
				{
					game_board_context.strokeStyle = "rgb(200 , 200 , 200)"
					game_board_context.strokeRect(next_x_start_x_index , next_y_start_y_index , box_width , box_height)
				}*/

			}
			else
			{
				//fix this
				var next_x_start_x_index = i * (box_width + box_width_padding)
	
				var next_y_start_y_index = j * (box_height + box_height_padding)
				

				var r = Math.max(255 - d , 225)
				var g = Math.max(255 - d , 225)
				var b = Math.max(255 - d , 225)

				if(viewport)
				{
					r = 230
					g = 230
					b = 230
				}

				game_board_context.fillStyle = "rgb(" + r + "," + g + "," + b + ")"
				game_board_context.fillRect(next_x_start_x_index , next_y_start_y_index , box_width , box_height)
				
				//game_board_context.strokeSytle = null
				//game_board_context.strokeRect(next_x_start_x_index , next_y_start_y_index , box_width , box_height)

			}


		}
	}

}


function initialize_game_board()
{
	game_board = document.getElementById('game_board');
	
	game_board.width = game_board_width
	game_board.height = game_board_height

	game_board_context = game_board.getContext("2d")

	for(i = 0; i < num_box_width; i ++)
	{
		for(j = 0; j < num_box_height; j++)
		{
			
			game_board_context.fillStyle = "rgb(225 , 225 , 225)"
			var start_x_index = i * (box_width + box_width_padding)
			var end_x_index = start_x_index + box_width

			var start_y_index = j * (box_height + box_height_padding)
			var end_y_index = start_y_index + box_height
			
			game_board_context.fillRect(start_x_index , start_y_index , box_width , box_height)
		
			//var start_x_padding_index = end_x_index
			//var end_x_padding_index = end_x_index + box_width_padding
	
			//var start_y_padding_index = end_y_index
			//var end_y_padding_index = end_y_index + box_height_padding
			
			//game_board_context.fillStyle = "rgb(255 , 255 , 255)"
			//game_board_context.fillRect(start_x_padding_index , start_y_index , end_x_padding_index , end_y_index)
			//game_board_context.fillRect(start_x_index , start_y_padding_index , end_x_index , end_y_padding_index)
		
			
			//alert("Start x " + start_x_padding_index + " End x " + end_x_padding_index + " Start y " + start_y_index + " End y " + end_y_index)
		}
	}
}
