{% 
Dim i 
Dim inputName
Dim ar = CurrentQuestion.AvailableResponses
Dim numberOfStars = CurrentADC.PropValue("numberOfStars").ToNumber()

For i = 1 To ar.Count 
	inputName = CurrentQuestion.InputName() 
	%}
{element : $('#{%= inputName%}'), value : {%= ar[i].inputValue()%}}{%= On(i < ar.Count, ",", "") %}
{% Next %}