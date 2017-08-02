{% 
Dim i 
Dim inputName
Dim ar = CurrentQuestion.ParentLoop.Answers
Dim numberOfStars = CurrentADC.PropValue("numberOfStars").ToNumber()

For i = 1 To ar.Count 
	inputName = CurrentQuestion.Iteration(i).InputName()
%}
{element : document.getElementById('{%= inputName%}')}{%= On(i < ar.Count, ",", "") %}
{% Next %}