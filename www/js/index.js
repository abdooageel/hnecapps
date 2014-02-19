$(document).ready(function(){
	/*var dataSource = [
		{region: "Male", val: 4119626293},
		{region: "Female", val: 1012956064},
		
	];*/
/*
{region: "الجبل 1", val: 344124520},
		{region: "الجبل2", val: 590946440},
		{region: "الزاوية", val: 727082222},
		{region: "العزيزية", val: 35104756},
		{region: "الكفرة", val: 4119626293},
		{region: "أوباري", val: 1012956064},
		{region: "بنغازي", val: 344124520},
		{region: "درنة", val: 590946440},
		{region: "سبها", val: 727082222},
		{region: "سرت", val: 35104756},
		{region: "طبرق", val: 4119626293},
		{region: "طرابلس", val: 1012956064},
		{region: "غدامس", val: 344124520},
		{region: "مصراته", val: 590946440}*/
	$/*("#chartContainer").dxPieChart({
		dataSource: dataSource,
		title: "Total Voters",
		tooltip: {
			enabled: true,
			format:"millions",
			percentPrecision: 2,
			customizeText: function() { 
				return this.valueText + " - " + this.percentText;
			}
		},
		legend: {
			horizontalAlignment: "right",
			verticalAlignment: "top",
			margin: 0
		},
		series: [{
			type: "doughnut",
			argumentField: "region",
			label: {
				visible: true,
				format: "millions",
				connector: {
					visible: true
				}
			}
		}]
	});*/
	var dataSource = [
	{state: "اجدابيا", male: 7.956, female: 91.827},
    {state: "البيضاء", male: 50.956, female: 30.827},
    {state: "الجبل 1", male: 20.956, female: 50.827},
    {state: "الجبل 2", male: 40.956, female: 20.827},
    {state: "الجبل2", male: 70.155, female: 10.827},
		{state: "الزاوية", male: 10.155, female: 20.827},
		{state: "العزيزية", male: 30.155, female: 10.827},
		{state: "الكفرة", male: 50.155, female: 10.827},
		{state: "أوباري", male: 60.155, female: 10.827},
		{state: "بنغازي", male: 70.155, female: 20.827},
		{state: "درنة", male: 10.155, female: 70.827},
		{state: "سبها", male: 15.155, female: 44.827},
		{state: "سرت", male: 55.155, female: 22.827},
		{state: "طبرق", male: 66.155, female: 22.827},
		{state: "طرابلس", male: 77.155, female: 5.827},
		{state: "غدامس", male: 40.155, female: 40.827},
		{state: "مصراته", male: 31.155, female: 30.827},

    ];

$("#officeContainer").dxChart({
    dataSource: dataSource,
    commonSeriesSettings: {
        argumentField: "state",
        type: "stackedBar"
    },
    series: [
        { valueField: "male", name: "Male", stack: "male" },
        { valueField: "female", name: "Female", stack: "male" },
        
    ],
    legend: {
        horizontalAlignment: "right",
        position: "inside",
        border: { visible: true }
    },
    valueAxis: {
        title: {
            text: "Males / Females"
        }
    },
    title: "Voters by Office Males/Females",
    tooltip: {
        enabled: true
    }
});
});