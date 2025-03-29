
import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

function NetworkGraph({ story }) {
  const svgRef = useRef(null);
  const [networkData, setNetworkData] = useState(null);

  useEffect(() => {
    if (!story) return;

    // In a real app, this would fetch actual network data from API
    // For this prototype, we'll generate random data based on the story
    const generateMockNetworkData = (story) => {
      const nodes = [];
      const links = [];
      
      // Add storyteller
      nodes.push({
        id: "storyteller",
        name: story.storyteller,
        role: story.storytellerRole,
        type: "storyteller"
      });
      
      // Add target
      nodes.push({
        id: "target",
        name: story.target,
        role: story.targetRole,
        type: "target"
      });
      
      // Add intermediaries (number based on stepsAway - 1)
      const intermediaries = story.stepsAway - 1;
      for (let i = 0; i < intermediaries; i++) {
        const intermediaryName = `Person ${i+1}`;
        nodes.push({
          id: `intermediary-${i}`,
          name: intermediaryName,
          role: "Intermediary",
          type: "path"
        });
        
        // Connect to previous node or storyteller
        links.push({
          source: i === 0 ? "storyteller" : `intermediary-${i-1}`,
          target: `intermediary-${i}`,
          value: 1
        });
        
        // Connect last intermediary to target
        if (i === intermediaries - 1) {
          links.push({
            source: `intermediary-${i}`,
            target: "target",
            value: 1
          });
        }
      }
      
      // If no intermediaries, connect directly
      if (intermediaries === 0) {
        links.push({
          source: "storyteller",
          target: "target",
          value: 1
        });
      }
      
      // Add some random connections
      for (let i = 0; i < 5; i++) {
        const randomNode1 = nodes[Math.floor(Math.random() * nodes.length)].id;
        const randomNode2 = nodes[Math.floor(Math.random() * nodes.length)].id;
        
        if (randomNode1 !== randomNode2) {
          links.push({
            source: randomNode1,
            target: randomNode2,
            value: 0.5 // Weaker connection
          });
        }
      }
      
      return { nodes, links };
    };
    
    setNetworkData(generateMockNetworkData(story));
  }, [story]);
  
  useEffect(() => {
    if (!networkData || !svgRef.current) return;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    const width = 280;
    const height = 300;
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    // Create a force simulation
    const simulation = d3.forceSimulation(networkData.nodes)
      .force("link", d3.forceLink(networkData.links).id(d => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(networkData.links)
      .enter().append("line")
      .attr("stroke", d => d.value === 1 ? "#aaa" : "#ddd")
      .attr("stroke-width", d => d.value === 1 ? 2 : 1)
      .attr("stroke-dasharray", d => d.value === 1 ? 0 : 3);
    
    // Create node groups
    const node = svg.append("g")
      .selectAll(".node")
      .data(networkData.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add circles for nodes
    node.append("circle")
      .attr("r", 8)
      .attr("fill", d => {
        if (d.type === "storyteller") return "#ff6347";
        if (d.type === "target") return "#4682b4";
        return "#ffa500";
      });
    
    // Add labels
    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(d => d.name)
      .style("font-size", "10px")
      .style("fill", "#333");
    
    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => Math.max(10, Math.min(width - 10, d.source.x)))
        .attr("y1", d => Math.max(10, Math.min(height - 10, d.source.y)))
        .attr("x2", d => Math.max(10, Math.min(width - 10, d.target.x)))
        .attr("y2", d => Math.max(10, Math.min(height - 10, d.target.y)));
        
      node.attr("transform", d => `translate(${Math.max(10, Math.min(width - 10, d.x))},${Math.max(10, Math.min(height - 10, d.y))})`);
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return () => {
      simulation.stop();
    };
  }, [networkData]);
  
  if (!story) {
    return (
      <div className="empty-state">
        <p>Select a story to view network</p>
      </div>
    );
  }
  
  return (
    <div className="network-graph">
      <h2>Network Visualization</h2>
      
      <div className="graph-container">
        <div className="legend">
          <div className="legend-item">
            <div className="dot storyteller"></div>
            <span>Storyteller</span>
          </div>
          <div className="legend-item">
            <div className="dot target"></div>
            <span>Target</span>
          </div>
          <div className="legend-item">
            <div className="dot path"></div>
            <span>Path</span>
          </div>
        </div>
        
        <svg ref={svgRef}></svg>
      </div>
      
      <div className="network-stats">
        <p>Current distance: <span className={story.stepsAway <= 2 ? 'close' : story.stepsAway >= 6 ? 'far' : 'medium'}>
          {story.stepsAway} steps
        </span></p>
      </div>
    </div>
  );
}

export default NetworkGraph;
