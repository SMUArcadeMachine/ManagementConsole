import Ember from 'ember';

export default Ember.Component.extend({
  chartOptions: {
  chart: {
    type: 'bar'
  },
  title:{
    text:'Game Activity'
  },
  xAxis:{
     categories: ['Donkey Kong', 'Galaga', 'Frogger', 'Tetris', 'Pac-Man', 'Asteroids' ]
  },
  yAxis:{
    title: {
      text: '# of Plays'
    }
  },
},


	chartData:[{
    name:"plays",
		data: [21, 15, 11, 9 , 17, 5]
  }
	],
});
