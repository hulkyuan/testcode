
/**
 * Convert a midi note into a pitch
 */
export function midiToPitch(midi) {
	const octave = Math.floor(midi / 12);
	return midiToPitchClass(midi) + octave.toString();
}

/**
 * Convert a midi note to a pitch class (just the pitch no octave)
 */
export function midiToPitchClass(midi) {
	const scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	const note = midi % 12;
	return scaleIndexToNote[note];
}

/**
 * Convert a pitch class to a MIDI note
 */
function pitchClassToMidi(pitch) {
	const scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	return scaleIndexToNote.indexOf(pitch);
}


/**
 * 
 * @param midi
 * @returns 音阶
 */
function octave(midi) {
	return Math.floor(midi / 12) - 1;
}
const noteHeightScale = 1.5
const defaultOffset = 9;
//E4(midi64),F4(midi65)应该是中心线 最右边是108 最左21
const getWhiteKey = () => {
	let whiteKey = document.querySelector('#white').value || 23.5;
	return Number(whiteKey);
	// let minWhite = (document.querySelector('#minwhite') as any).value || 22;
	// const widthOffset = whiteKey - minWhite;
	// if (offset > 65) {
	// 	let more = (offset - 65) * widthOffset / 43;
	// 	return Number(whiteKey - more)
	// } else if (offset < 64) {
	// 	let more = (64 - offset) * widthOffset / 43;
	// 	return Number(whiteKey - more)
	// } else {
	// 	return Number(whiteKey);
	// }

}
const getBlackKey = ( ) => {
	const blackKey = document.querySelector('#black').value || 15;
	return Number(blackKey);
	// let whiteKey = (document.querySelector('#white') as any).value || 23.5;
	// let minWhite = (document.querySelector('#minwhite') as any).value || 22;
	// const widthOffset = whiteKey - minWhite;
	// if (offset > 65) {
	// 	let more = (offset - 65) * widthOffset / 43;
	// 	return Number(blackKey - more)
	// } else if (offset < 64) {
	// 	let more = (64 - offset) * widthOffset / 43;
	// 	return Number(blackKey - more)
	// } else {
	// 	return Number(blackKey);
	// }
}
/**
 * 88键钢琴有白键：52，黑键：36。7组完整的八度音符（包含7个白键，5个黑键），多余3个白键，一个黑键
 * 最左侧多出3个音符，分别是A,A#,B;最右侧多出一个C
 * the width of black keys averaging 13.7 mm (0.54 in) and white keys about 23.5 mm (0.93 in) at the base, disregarding space between keys
 */
export const pianoKeySize = {
	/**
	 * 图形宽度
	 */
	widthOfWhite: getWhiteKey,
	widthOfBlack: getBlackKey,
	noteOffsetX: 2,
	keyHeight: 100 * noteHeightScale,
	heightOfBlack: 66,
	scaleDuration: 100,
}

/**
 * 黑键索引1,3,6,8,10
 * E4(midi64),F4(midi65)应该是中心线
 */
export const pianoKey = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const blackKeyIndex = [1, 3, 6, 8, 10];
const whiteKeyIndex = [0, 2, 4, 5, 7, 9, 11];
const blackKeyOffset = [-0.1, 0.2, -0.1, 0, 0.2];

/**
 * 
 * @param offset 偏移键位 midi序号
 * @returns 偏移像素
 */
const offsetCalculation = (offset=0) => {
	const regexp = /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i;
	const offsetMid = midiToPitch(offset);
	const split = regexp.exec(offsetMid)
	const pitch = split[1];
	const octave = Number(split[2]);
	const noteIndex = pianoKey.indexOf(pitch);
	if (blackKeyIndex.includes(noteIndex)) {
		let blackIndex = blackKeyIndex.findIndex(element => element === noteIndex);
		if (blackIndex > 1) {
			blackIndex += 1;
		}
		return -((blackIndex + 1) * pianoKeySize.widthOfWhite()) - pianoKeySize.widthOfBlack() / 2 + (octave) * pianoKeySize.widthOfWhite() * 7;
	} else {
		const whiteIndex = whiteKeyIndex.findIndex(element => element === noteIndex);
		return -(whiteIndex * pianoKeySize.widthOfWhite()) + (octave) * pianoKeySize.widthOfWhite() * 7
	}
}
const gradualWidth = (offset) => {
	let whiteKey = document.querySelector('#white').value || 23.5;
	let minWhite = document.querySelector('#minwhite').value || 22;
	const widthOffset = whiteKey - minWhite;
	let width = pianoKeySize.widthOfWhite() - pianoKeySize.noteOffsetX + 3;
	if (offset > 65) {
		let more = (offset - 65) * widthOffset / 43;
		width = width - more
		return width
	} else if (offset < 64) {
		let more = (64 - offset) * widthOffset / 43;
		width = width - more
		return width
	} else {
		return width;
	}
}
/**
 * 
 * @param note e.g {name:'C#3',duration:0.49222,mid:50}
 * @param offset 偏移琴键数 
 * @returns 
 */
export const noteToLocation = function (note, offset) {
	const regexp = /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i;
	const split = regexp.exec(note.name)
	const pitch = split[1];
	const octave = Number(split[2]);
	const noteIndex = pianoKey.indexOf(pitch);
	const offsetX = offsetCalculation(offset);
	let location;
	if (blackKeyIndex.includes(noteIndex)) {
		let blackOffset;
		let blackIndex = blackOffset = blackKeyIndex.findIndex(element => element === noteIndex);
		if (blackIndex > 1) {
			blackIndex += 1;
		}
		const blackOffsetX = blackKeyOffset[blackOffset] * pianoKeySize.widthOfBlack()
		location = {
			x: ((blackIndex + 1) * pianoKeySize.widthOfWhite()) + blackOffsetX - pianoKeySize.widthOfBlack() / 2 + (octave) * pianoKeySize.widthOfWhite() * 7 + offsetX,
			y: -note.time * pianoKeySize.keyHeight - pianoKeySize.keyHeight * note.duration,
			width: pianoKeySize.widthOfBlack() - pianoKeySize.noteOffsetX,
			height: pianoKeySize.keyHeight * note.duration,
			color: 'black'
		}
	} else {
		const whiteIndex = whiteKeyIndex.findIndex(element => element === noteIndex);
		location = {
			x: (whiteIndex * pianoKeySize.widthOfWhite()) + (octave) * pianoKeySize.widthOfWhite() * 7 + offsetX,
			y: -note.time * pianoKeySize.keyHeight - pianoKeySize.keyHeight * note.duration,
			width: pianoKeySize.widthOfWhite() - pianoKeySize.noteOffsetX + 2,
			// width: gradualWidth(note.midi),
			height: pianoKeySize.keyHeight * note.duration,
			color: 'white'
		}
	}
	return location
}