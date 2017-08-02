DomReady.ready(function() {
     
    var starRating = new StarRating({
        instanceId : '{%= CurrentADC.InstanceId%}',
        currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
      	use : '{%= CurrentADC.PropValue("use") %}',
		target : 'jsObj{%= CurrentADC.InstanceId%}',
		width : 400,
		controlWidth : '{%= CurrentADC.PropValue("controlWidth") %}',
		controlAlign : '{%= CurrentADC.PropValue("controlAlign") %}',
		maxWidth : '{%= CurrentADC.PropValue("maxWidth") %}',
        animateResponses: {%= (CurrentADC.PropValue("animateResponses") = "1") %},
		autoForward: {%= (CurrentADC.PropValue("autoForward") = "1") %},
		numberOfStars: {%= CurrentADC.PropValue("numberOfStars") %},
		backgroundSize: '{%:= Browser.Support("backgroundsize")%}',
		isInLoop: {%= (CurrentADC.PropValue("isInLoop") = "1") %},
		isSingle : {%= (CurrentQuestion.Type = "single") %},
		showTooltips: {%= (CurrentADC.PropValue("showTooltips") = "1") %},
		rowVerticalAlignment: '{%= CurrentADC.PropValue("rowVerticalAlignment") %}',
		maxImageWidth : {%= CurrentADC.PropValue("maxImageWidth") %},
		maxImageHeight : {%= CurrentADC.PropValue("maxImageHeight") %},
		forceImageSize : '{%= CurrentADC.PropValue("forceImageSize") %}',
		dkSingle: {%= (CurrentADC.PropValue("dkSingle") = "1") %},
		dkLeftMargin: '{%= CurrentADC.PropValue("dkLeftMargin") %}',
      	currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
		items : [
			{% IF CurrentADC.PropValue("isInLoop") = "1" Then %}
				{% IF CurrentQuestion.Type = "single" Then %}
					{%:= CurrentADC.GetContent("dynamic/standard_single_loop.js").ToText()%}
				{% ElseIf CurrentQuestion.Type = "numeric" Then %}
					{%:= CurrentADC.GetContent("dynamic/standard_numeric_loop.js").ToText()%}
				{% EndIF %}
			{% Else %}
				{% IF CurrentQuestion.Type = "single" Then %}
					{%:= CurrentADC.GetContent("dynamic/standard_single.js").ToText()%}
				{% ElseIf CurrentQuestion.Type = "numeric" Then %}
					{%:= CurrentADC.GetContent("dynamic/standard_numeric.js").ToText()%}
				{% EndIF %}
			{% EndIF %}
		]
	});
});