import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';

class FlawsTableRow extends Component {

  constructor(props) {
      super(props);
      this.delete = this.delete.bind(this);
      this.toggleRow = this.toggleRow.bind(this);
      this.state = {
        showMore: false
      }
    }
    delete(e) {
        e.preventDefault();

        axios.defaults.baseURL = '';
        axios.get('/flaws/delete/'+this.props.obj._id,{ baseUrl: "" })
            .then(console.log('Deleted for:', this.props.sheet))
            .then(res => {
                axios.get('/flaws/'+this.props.sheet,{ baseUrl: "" })
                  .then(response => {
                    this.props.flawsSetter(response.data);
                    // this.setState({ hasFlawss: response.data });
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
              })
            .catch(err => console.log(err));
        // window.open("/");
        // window.location = '/';
    }
    toggleRow(e){
      e.preventDefault();
      // console.log("toggleRow", this.props.index);
      // var i = this.props.index;
      // var elem = this.refs["longTR_"+i];
      // var style = elem.style.display;

      // if(style.includes("none")){
      //   style = "";
      // }else{
      //   style = "none";
      // }
      if(this.state.showMore){
        this.setState({showMore: false});
      }else{
        this.setState({showMore: true});
      }
      


      // console.log("toggleRow", elem, this.refs);
    }
  render() {
    return (
          <React.Fragment>

        <tr>
          <td>
            {this.props.obj.name}
          </td>
          <td>
            {this.props.obj.cost}
          </td>
          <td>
            {this.props.obj.desc}
          </td>
          <td>
            <button onClick={this.delete} className="btn btn-danger">Delete</button>
          </td>
          <td>
            <button onClick={this.toggleRow} className="btn">More..</button>
          </td>
        </tr>

        { this.state.showMore &&
        <React.Fragment>
          <tr style={{display: (this.props.obj.prereq.includes("N/A") || !this.props.obj.prereq) ? "none" : ""}}>
            <th>Pre-Requistes:</th>
            <td colSpan="4"> {this.props.obj.prereq}
            </td>
          </tr>
          <tr style={{display: this.props.obj.benefit ? "" : "none"}}>
            <th>Benefit:</th>
            <td colSpan="4"> {this.props.obj.benefit}
            </td>
          </tr>
          <tr style={{display: (this.props.obj.aspects&&this.props.obj.aptitudes) ? "" : "none"}}>
            <th>Aspect & Aptitude:</th>
            <td colSpan="2"> {this.props.obj.aspects}</td>
            <td colSpan="2"> {this.props.obj.aptitudes}</td>
          </tr>
        </React.Fragment>
        }
            
        </React.Fragment>

    );
  }
}

export default FlawsTableRow;