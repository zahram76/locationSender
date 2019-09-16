import React , {Fragment, Component} from "react";
import {Polyline} from "react-native-maps";



export default class AnimatingPolylineComponent extends Component {
    state = {
       polylinePath: this.props.Direction,
       strokeColor: this.props.strokeColor,
       key: this.props.id
    };
    
    componentDidMount() {
       this.animatePolyline();
    }
    
    animatePolyline = () => {
       this.interval = setInterval(() => this.animatePolylineStart(), 70);
    };
    
    componentWillUnmount() {
       clearInterval(this.interval);
    }
    
    animatePolylineStart = () => {
        
       if (this.state.polylinePath.length < this.props.Direction.length) {
          const Direction = this.props.Direction;
          const polylinePath = [
             ...Direction.slice(0, this.state.polylinePath.length - 1)
          ];
          this.setState({polylinePath});
       } else {
          this.setState({polylinePath: []})
       }
    };
    
    render() {
       return (
          <Fragment>
             {
                (this.state.polylinePath.length > 0) && <Polyline
                   key={this.state.key}
                   coordinates={this.state.polylinePath}
                   strokeColor={this.state.strokeColor}
                   strokeWidth={6}
                />
             }
          </Fragment>
       )
    }
 }