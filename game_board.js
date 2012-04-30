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
	box_width_padding = 5
	box_height_padding = 5

	box_width = 20
	box_height = 20

	num_box_width = 50
	num_box_height = 20

	game_board_width = box_width * num_box_width + box_width_padding * num_box_width
	game_board_height = box_height * num_box_height + box_height_padding * num_box_height

	initialize_game_board()
	start_game(7)
}

function start_game(num_music_makers)
{
	//var textbox = document.getElementById("points_input")

	initialize_actors()
	initialize_game_board_arr()
	initialize_audio()

	curr_time = 0

	//num_music_makers = parseInt(textbox.value)

	if(num_music_makers == 0)
	{
		num_music_makers = 7
	}

	initialize_player()
	initialize_music_makers(num_music_makers)

	interval = 4

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
		else if(event.keyCode == 187)
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
	});

	update()
	

}

function initialize_music_makers(num)
{
	var tones = [60 , 120 , 180 , 240 , 300 , 360 , 420 , 480 , 600]
	var color_choices = [25 , 50 , 75 , 100 , 125]

	for(var i = 0; i < num; i++)
	{
		var tone = tones[Math.floor(Math.random() * tones.length)]
		
		var color_r = color_choices[Math.floor(Math.random() * color_choices.length)]
		var color_g = color_choices[Math.floor(Math.random() * color_choices.length)]
		var color_b = color_choices[Math.floor(Math.random() * color_choices.length)]
	
		var frequency = 2 * Math.floor(Math.random() * 8 + 2)

		var x_location = Math.floor(Math.random() * num_box_width)
		var y_location = Math.floor(Math.random() * num_box_height)

		var music = new music_maker( x_location , y_location , frequency , tone , [color_r , color_g , color_b])

		actors.push(music)
	}
}

function initialize_player()
{
	
	p = new player(10 , 10 , 0 , 0 , 0 , 0 , [50 , 100 , 50])
	actors.push(p)
	game_board_arr[10][10] = p

}

function initialize_audio()
{
	audio_context = new webkitAudioContext()
}

function play_noise(tone , intensity , channel)
{
	var noise = audio_context.createBufferSource()
	var audio_buffer = audio_context.createBuffer(2 , 4096 , 44100)

	var buf = audio_buffer.getChannelData(channel)
	for(i = 0; i < audio_buffer.length; i ++)
	{
		
		
		buf[i] = Math.sin(tone * Math.PI * 2 * i / 44100)
	}


	noise.buffer = audio_buffer

	var gain_node = audio_context.createGainNode()
	gain_node.gain.value = intensity / 7.0
	noise.connect(gain_node)
	gain_node.connect(audio_context.destination)
	noise.noteOn(audio_context.currentTime)

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

	//update_board()

	
	update_actors()
	update_board()

	setTimeout("update()" , interval * 62)
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
					
					var tone = (dest_actor.tone + src_actor.tone) / 2
					var player_distance = Math.abs(p.x_index - src_actor.x_index) + Math.abs(p.y_index - src_actor.y_index)

					var intensity = (dest_actor.intensity + src_actor.intensity) / (player_distance * 4)
					
					var channel = dest_actor.x_direction >= 0 ? 0 : 1
					
					play_noise(tone , intensity , channel)
					
					game_board_arr[curr_x_index][curr_y_index] = null
					to_remove.push(src_actor)

					to_remove.push(dest_actor)
				
				}
				else if(dest_actor instanceof player)
				{
					var tone = src_actor.tone
					var intensity = src_actor.intensity
	
					var channel = src_actor.x_direction >= 0 ? 0 : 1
					play_noise(tone , intensity , channel)

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
					var intensity = dest_actor.intensity
	
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
			if(game_board_arr[i][j] != null)
			{
				var next_x_start_x_index = i * (box_width + box_width_padding)
	
				var next_y_start_y_index = j * (box_height + box_height_padding)
				
				game_board_context.fillStyle = "rgb(" + game_board_arr[i][j].color[0] + "," + game_board_arr[i][j].color[1] + "," + game_board_arr[i][j].color[2] + ")"
				game_board_context.fillRect(next_x_start_x_index , next_y_start_y_index , box_width , box_height)


			}
			else
			{
				//fix this
				var next_x_start_x_index = i * (box_width + box_width_padding)
	
				var next_y_start_y_index = j * (box_height + box_height_padding)
				
				game_board_context.fillStyle = "rgb(230 , 230 , 230)"
				game_board_context.fillRect(next_x_start_x_index , next_y_start_y_index , box_width , box_height)


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
			
			game_board_context.fillStyle = "rgb(230 , 230 , 230)"
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
