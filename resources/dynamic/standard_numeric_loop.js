{% 
Dim i 
Dim j
Dim inputName
Dim ar = CurrentQuestion.ParentLoop.AvailableAnswers
Dim numberOfStars = CurrentADC.PropValue("numberOfStars").ToNumber()
Dim allValues = "1"

For j = 2 to numberOfStars
	allValues = allValues + "," + j
Next

For i = 1 To ar.Count 
	inputName = CurrentQuestion.Iteration(i).InputName()
%}
{element : document.getElementById('{%= inputName%}'), allValues : "{%= allValues%}"}{%= On(i < ar.Count, ",", "") %}
{% Next %}