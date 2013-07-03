window.Label = function(body) {
	this.body = body ;
	this.shape = new fabric.Text(body.getName(), {
		fontSize: 12,
		textAlign: 'left',
		lineHeight:0.9
	}) ;
} ;

Label.prototype.getShape = function() {
	return this.shape ;
} ;

Label.prototype.draw = function(zoom, offset) {
	// update text
	if(window.planetary.options.labelsVisible) {
		this.shape.setText(this.body.getName()
		+"\n"
		+"v="+(Math.round(Math.sqrt(this.body.velocity.x*this.body.velocity.x + this.body.velocity.y*this.body.velocity.y)*10)/10)
		+", m="+this.body.mass+", r="+Math.round(this.body.radius*10)/10
		+"\n"
		+"x="+Math.round(this.body.position.x*10)/10+", y="+Math.round(this.body.position.y*10)/10) ;
	}
	else {
		this.shape.setText('') ;
	}

	this.shape.set({
		left: (this.body.position.x) * zoom + this.body.radius*zoom + offset.x + this.shape.getWidth()/2 + 20,
		top: (this.body.position.y) * zoom + offset.y - this.shape.getHeight()*0.15
	}) ;
	
	//this.shape.scaleX = zoom ;
	//this.shape.scaleY = zoom ;
} ;