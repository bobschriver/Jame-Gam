function gen_next_valid(curr_x , curr_y , x_direction , y_direction , x_velocity , y_velocity)
{
	var next_x = Math.max(0 , Math.min(num_box_width -1 , curr_x + x_direction * x_velocity))
	var next_y = Math.max(0 , Math.min(num_box_height -1 , curr_y + y_direction * y_velocity))

	return [next_x , next_y]
}



function gen_neighbors(curr_x , curr_y)
{
	var x_start = Math.max(0 , curr_x - 1)
	var x_end = Math.min(num_box_width - 1 , curr_x + 1)

	var y_start = Math.max(0 , curr_y - 1)
	var y_end = Math.min(num_box_height - 1 , curr_y + 1)

	var neighbors = new Array()

	for(var i = x_start; i <= x_end; i++)
	{
		for(var j = y_start; j <= y_end; j++)
		{
			if(!(i == curr_x && j == curr_y))
			{
				neighbors.push([i , j])
			}
		}
	}

	return neighbors
}

function music_maker_move(current_time)
{
	

	if(current_time % this.frequency == 0)
	{
		var neighbors = gen_neighbors(this.x_index , this.y_index)

		for(i = 0; i < neighbors.length; i++)
		{
			var neighbor_x = neighbors[i][0]
			var neighbor_y = neighbors[i][1]

			var direction_x = neighbor_x - this.x_index
			var direction_y = neighbor_y - this.y_index

			var note = new music_note(neighbor_x , neighbor_y , direction_x , direction_y , 1 , 1 , [this.color[0] + 40 , this.color[1] + 40 , this.color[2] + 40] , this.tone , 7)

			actors.push(note)
			//Should replace all these accesses with one that will support multiple game boards
			game_board_arr[neighbor_x][neighbor_y] = note
		}
	}
}

function player_move(current_time)
{
	var next_index = gen_next_valid(this.x_index , this.y_index , this.x_direction , this.y_direction , this.x_velocity , this.y_velocity)

	var next_x = next_index[0]
	var next_y = next_index[1]

	this.x_index = next_x
	this.y_index = next_y

}

function check_horizontal(curr_x , curr_y)
{
	return game_board_get(curr_x - 1 , curr_y) instanceof music_note && game_board_get(curr_x + 1 , curr_y) instanceof music_note
}

function check_vertical(curr_x , curr_y)
{
	return game_board_get(curr_x , curr_y - 1) instanceof music_note && game_board_get(curr_x , curr_y + 1) instanceof music_note
}

function check_edge_down_right(curr_x , curr_y)
{
	return game_board_get(curr_x , curr_y + 1) instanceof music_note && game_board_get(curr_x + 1 , curr_y) instanceof music_note
}

function check_edge_down_left(curr_x , curr_y)
{
	return game_board_get(curr_x , curr_y + 1) instanceof music_note && game_board_get(curr_x - 1 , curr_y) instanceof music_note
}

function check_edge_up_right(curr_x , curr_y)
{
	return game_board_get(curr_x , curr_y - 1) instanceof music_note && game_board_get(curr_x + 1 , curr_y) instanceof music_note
}

function check_edge_up_left(curr_x , curr_y)
{
	return game_board_get(curr_x , curr_y - 1) instanceof music_note && game_board_get(curr_x - 1 , curr_y) instanceof music_note
}

function check_crook_up_left(curr_x , curr_y)
{
	return game_board_get(curr_x - 1 , curr_y - 1) instanceof music_note && game_board_get(curr_x, curr_y + 1) instanceof music_note
}

function check_crook_up_right(curr_x , curr_y)
{
	return game_board_get(curr_x + 1 , curr_y - 1) instanceof music_note && game_board_get(curr_x, curr_y + 1) instanceof music_note
}

function check_crook_down_left(curr_x , curr_y)
{
	return game_board_get(curr_x - 1 , curr_y + 1) instanceof music_note && game_board_get(curr_x, curr_y -1) instanceof music_note
}

function check_crook_down_right(curr_x , curr_y)
{
	return game_board_get(curr_x + 1 , curr_y + 1) instanceof music_note && game_board_get(curr_x, curr_y - 1) instanceof music_note
}

function check_crook_right_up(curr_x , curr_y)
{
	return game_board_ger(curr_x - 1 , curr_y) instanceof music_note && game_board_get(curr_x + 1 , curr_y - 1) instanceof music_note
}

function check_crook_right_down(curr_x , curr_y)
{
	return game_board_get(curr_x - 1 , curr_y) instanceof music_note && game_board_get(curr_x + 1 , curr_y + 1) instanceof music_note
}

function check_crook_left_up(curr_x , curr_y)
{

	return game_board_get(curr_x - 1 , curr_y - 1) instanceof music_note && game_board_get(curr_x + 1 , curr_y) instanceof music_note
}

function check_crook_left_down(curr_x , curr_y)
{
	
	return game_board_get(curr_x - 1 , curr_y + 1) instanceof music_note && game_board_get(curr_x + 1 , curr_y) instanceof music_note
}

function simple_move(current_time)
{
	var next_valid = gen_next_valid(this.x_index , this.y_index , this.x_direction , this.y_direction , this.x_velocity , this.y_velocity)

	var next_x = next_valid[0]
	var next_y = next_valid[1]
	
	this.intensity -= 1

	this.color[0] += 2
	this.color[1] += 2
	this.color[2] += 2

	this.x_index = next_x
	this.y_index = next_y

}

function music_note_move(current_time)
{
	if(check_edge_up_right(this.x_index , this.y_index))
	{
		this.y_direction = 1
		this.x_direction = 0

		var note = new music_note(this.x_index , this.y_index , -1 , 0 , 1 , 0 , this.color , this.tone , this.intensity)

		actors.push(note)
		note.simple_move()

		this.simple_move()
	}
	else if(check_edge_up_left(this.x_index , this.y_index))
	{
		this.y_direction = 1
		this.x_direction = 0
	
		var note = new music_note(this.x_index , this.y_index , 1 , 0 , 1 , 0 , this.color , this.tone , this.intensity)
		actors.push(note)
		note.simple_move()
	
		this.simple_move()
	}
	else if(check_edge_down_right(this.x_index , this.y_index))
	{
		this.y_direction = -1
		this.x_direction = 0

		var note = new music_note(this.x_index , this.y_index , -1 , 0 , 1 , 0 , this.color , this.tone , this.intensity)
		actors.push(note)
		note.simple_move()
		
		this.simple_move()
	}
	else if(check_edge_down_left(this.x_index , this.y_index))
	{
		this.y_direction = -1
		this.x_direction = 0

		var note = new music_note(this.x_index , this.y_index , 1 , 0 , 1 , 0 , this.color , this.tone , this.intensity)
		actors.push(note)
		note.simple_move()
		
		this.simple_move()
	}
	else if(check_horizontal(this.x_index , this.y_index))
	{
		this.simple_move()
	}
	else if(check_vertical(this.x_index , this.y_index))
	{
		this.simple_move()
	}
	else if(check_crook_up_left(this.x_index , this.y_index))
	{
		this.x_direction = 1
		this.y_direction = -1

		this.x_velocity = 1
		this.y_velocity = 1

		var note = new music_note(this.x_index - 1, this.y_index, 1 , - 1 , 1 , 1 , this.color , this.tone , this.intensity)
		actors.push(note)
		note.simple_move()
	
		this.y_index += 1
		this.simple_move()
	}
	else if(check_crook_down_left(this.x_index , this.y_index))
	{
		this.x_direction = 1
		this.y_direction = 1

		this.x_velocity = 1
		this.y_velocity = 1

		var note = new music_note(this.x_index - 1 , this.y_index , 1 , 1 , 1 , 1, this.color , this.tone , this.intensity)

		actors.push(note)
		note.simple_move()

		this.y_index -= 1
		this.simple_move()

	}
	else if(check_crook_up_right(this.x_index , this.y_index))
	{
		this.x_direction = -1
		this.y_direction = -1

		this.x_velocity = 1
		this.y_velocity = 1

		var note = new music_note(this.x_index + 1, this.y_index, -1 , - 1 , 1 , 1 , this.color , this.tone , this.intensity)
		actors.push(note)
		note.simple_move()
	
		this.y_index += 1
		this.simple_move()

	}
	else if(check_crook_down_right(this.x_index , this.y_index))
	{
		this.x_direction = -1
		this.y_direction = 1

		this.x_velocity = 1
		this.y_velocity = 1

		var note = new music_note(this.x_index + 1, this.y_index, -1 , 1 , 1 , 1 , this.color , this.tone , this.intensity)
		actors.push(note)
		note.simple_move()
	
		this.y_index -= 1
		this.simple_move()
	}
	else if(check_crook_left_down(this.x_index , this.y_index))
	{
		this.x_direction = -1
		this.y_direction = -1

		this.x_velocity = 1
		this.y_velocity = 1

		var note = new music_note(this.x_index, this.y_index + 1, -1 , -1 , 1 , 1 , this.color , this.tone , this.intensity)
		actors.push(note)
		note.simple_move()
	
		this.x_index += 1
		this.simple_move()

	}
	else
	{
		this.simple_move()
	}
}

function music_note(x_index , y_index , x_direction , y_direction , x_velocity ,  y_velocity , color , tone , intensity)
{
	this.x_index = x_index
	this.y_index = y_index

	this.x_direction = x_direction
	this.y_direction = y_direction

	this.x_velocity = x_velocity
	this.y_velocity = y_velocity

	this.color = color
	this.tone = tone
	this.intensity = intensity

	this.simple_move = simple_move
	this.move = music_note_move
}

function music_maker(x_index , y_index , frequency , tone , color)
{
	this.x_index = x_index
	this.y_index = y_index

	this.color = color

	this.frequency = frequency
	this.tone = tone
	
	this.move = music_maker_move
}

function player(x_index , y_index , x_direction , y_direction , x_velocity , y_velocity , color)
{
	this.x_index = x_index
	this.y_index = y_index

	this.x_direction = x_direction
	this.y_direction = y_direction

	this.x_velocity = x_velocity
	this.y_velocity = y_velocity

	this.color = color

	this.move = player_move
}

