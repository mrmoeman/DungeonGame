class PathCalcData {
  constructor(checked, parentDataPosition, position, ignore) {
	this.position = position;
    this.parentPosition = parentDataPosition;
    this.checked = checked;
    this.ignore = ignore;
  }
}