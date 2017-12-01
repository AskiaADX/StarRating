{% 
Dim i 
Dim j
Dim inputName = CurrentQuestion.InputName()
Dim numberOfStars = CurrentADC.PropValue("numberOfStars").ToNumber()
Dim allValues = "1"

For j = 2 to numberOfStars
	allValues = allValues + "," + j
Next


For i = 1 To numberOfStars 
%}
{element : document.getElementById('{%= inputName%}'), allValues : "{%= allValues%}"}{%= On(i < numberOfStars, ",", "") %}
{% Next %}