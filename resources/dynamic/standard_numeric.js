{% 
Dim i 
Dim inputName = CurrentQuestion.InputName()
Dim numberOfStars = CurrentADC.PropValue("numberOfStars").ToNumber()

For i = 1 To numberOfStars 
%}
{element : document.getElementById('{%= inputName%}')}{%= On(i < numberOfStars, ",", "") %}
{% Next %}