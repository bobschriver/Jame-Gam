function random_normal(mu , sigma)
{
	r1 = Math.random()
	r2 = Math.random()
	
	z1 = Math.sqrt(-2 * Math.log(r1)) * Math.sin(2 * Math.PI * r2)

	r = mu + z1 * sigma
	
	return r
}

function random_normal_min_max(mu , sigma , min , max)
{
	r = random_normal(mu , sigma)

	r = Math.max(r , min)
	r = Math.min(r , max)

	return r
}
