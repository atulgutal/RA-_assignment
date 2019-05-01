import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Element } from "react-faux-dom";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempData: [],
      data: []
    };
  }

  async componentDidMount() {
    try {
      let response = await axios.get("http://localhost:3001/api/graph");
      if (response.status === 200) {
        console.log("Got success");
        let temp = JSON.parse(response.data);
        let result = temp[1].map(gdp => {
          let data1 = {};
          data1["date"] = gdp["date"];
          data1["value"] = gdp["value"] / 1000000000;
          return data1;
        });
        result = result.reverse();
        this.setState({ data: result });
      }
    } catch (err) {
      console.log("error ", err);
    }
  }

  plot = (chart, width, height) => {
    // create scales!

    const xScale = d3
      .scaleBand()
      .domain((this.state.data || []).map(d => d.date))
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.state.data || [], d => d.value)])
      .range([height, 0]);

    chart
      .selectAll(".bar")
      .data(this.state.data || [])
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.value))
      .attr("height", d => height - yScale(d.value))
      .attr("width", d => xScale.bandwidth() - 1)
      .style("fill", "steelblue");

    chart
      .selectAll(".bar-label")
      .data(this.state.data)
      .enter()
      .append("text")
      .classed("bar-label", true)
      .attr("x", d => xScale(d.date) + xScale.bandwidth() / 2)
      .attr("dx", -7)
      .attr("y", d => yScale(d.value))
      .attr("dy", -6)
      .text(d => d.value)
      .style("font-size", "8px");

    const xAxis = d3.axisBottom().scale(xScale);

    chart
      .append("g")
      .classed("x axis", true)
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    const yAxis = d3
      .axisLeft()
      .ticks(5)
      .scale(yScale);

    chart
      .append("g")
      .classed("y axis", true)
      .attr("transform", "translate(0,0)")
      .call(yAxis);

    chart
      .select(".x.axis")
      .append("text")
      .attr("x", width / 2)
      .attr("y", 60)
      .attr("fill", "#000")
      .style("font-size", "20px")
      .style("text-anchor", "middle")
      .text("Years");

    chart
      .select(".y.axis")
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("transform", `translate(-50, ${height / 2}) rotate(-90)`)
      .attr("fill", "#000")
      .style("font-size", "20px")
      .style("text-anchor", "middle")
      .text("GDP growth in billion dollars");

    const yGridlines = d3
      .axisLeft()
      .scale(yScale)
      .ticks(5)
      .tickSize(-width, 0, 0)
      .tickFormat("");

    chart
      .append("g")
      .call(yGridlines)
      .classed("gridline", true);
  };

  drawChart() {
    console.log("inside draw chart");
    const width = 1400;
    const height = 700;

    const el = new Element("div");
    const svg = d3
      .select(el)
      .append("svg")
      .attr("id", "chart")
      .attr("width", width)
      .attr("height", height);

    const margin = {
      top: 60,
      bottom: 100,
      left: 80,
      right: 40
    };

    const chart = svg
      .append("g")
      .classed("display", true)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    this.plot(chart, chartWidth, chartHeight);

    return el.toReact();
  }

  render() {
    console.log("inside render");
    return (
      <div>
        <h3>United States GDP Growth Rate for the past 60 years</h3>
        <div className="App">{this.drawChart()}</div>
      </div>
    );
  }
}

export default App;
