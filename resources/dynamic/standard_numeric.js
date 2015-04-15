{% 
Dim i 
Dim inputName = CurrentQuestion.InputName()
Dim numberOfStars = CurrentADC.PropValue("numberOfStars").ToNumber()

For i = 1 To numberOfStars 
%}
{element : $('#{%= inputName%}')}{%= On(i < numberOfStars, ",", "") %}
{% Next %}