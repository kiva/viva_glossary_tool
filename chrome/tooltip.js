$(function() {
	$('body').prepend($('<div>', {class: 'tooltip'}));

	$('body').mouseup((e) => {
		let selection = window.getSelection()
		let selectionText = selection.toString().trim()
		if (selectionText !== "") {
			let rect = selection.getRangeAt(0).getBoundingClientRect()
			displayTooltip(rect, selectionText)
		}
	})
	$('.tooltip').click(() => {
		$('.tooltip').css({'visibility': 'hidden'})
	})
})

function getSelectionText() {
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function displayTooltip(rect, selection) {
	let tt = $('.tooltip')
	tt.text("hi")
	tt.css({
		'left': (rect.left + rect.width/2 - tt.width()/2) + 'px',
		'top': (rect.top - 40) + 'px',
		'visibility': 'visible'
	})
}