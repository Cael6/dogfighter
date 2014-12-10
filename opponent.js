
var opp_spd = 0.00;

function oppJumpTo(position){
	pl_pos[0] = position[0];
	pl_pos[0] = position[1];
	pl_pos[0] = position[2];
}

function oppMoveTow(position){
	var dPos = subVec(position, pl_pos);
	dPos = scaleVec(dPos, opp_spd);

	pl_pos[0] = pl_pos[0] + dPos[0];
	pl_pos[1] = pl_pos[1] + dPos[1];
	pl_pos[2] = pl_pos[2] + dPos[2];
}