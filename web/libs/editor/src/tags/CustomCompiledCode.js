export const DEBUG_CODE = `
      function({
          React,
          getValue,
          setValue,
          item,
          annotation,
          store,
          task,
          regions,
          addRegion,
          deleteRegion,
          clearAllRegions,
          state,
          saveState,
          metadata,
          saveMetadata,
          deleteMetadata,
          clearAllMetadata,
          tags,
          getTagValue,
          setTagValue
        }) {
          const {
            useState
          } = React;
          const [count, setCount] = useState(getValue() || 0);
          const increment = () => {
            const newCount = count + 1;
            setCount(newCount);
            setValue(newCount);
          };
          console.log("Item from client app", item);
          console.log("Annotation from client app", annotation);
          console.log("Store from client app", store);
          console.log("Task from client app", task);
          console.log("Regions from client app", regions);
          console.log("Add region from client app", addRegion);
          console.log("Delete region from client app", deleteRegion);
          console.log("Clear all regions from client app", clearAllRegions);
          console.log("State from client app", state);
          console.log("Save state from client app", saveState);
          console.log("Metadata from client app", metadata);
          console.log("Save metadata from client app", saveMetadata);
          console.log("Delete metadata from client app", deleteMetadata);
          console.log("Clear all metadata from client app", clearAllMetadata);
          console.log("Tags from client app", tags);
          console.log("Get tag value from client app", getTagValue);
          console.log("Set tag value from client app", setTagValue);

          const contextFields = [{
              name: "React",
              value: React
            }, {
              name: "useState",
              value: useState
            }, {
              name: "regions",
              value: regions
            }, {
              name: "addRegion",
              value: addRegion
            }, {
              name: "deleteRegion",
              value: deleteRegion
            }, {
              name: "clearAllRegions",
              value: clearAllRegions
            }, {
              name: "state",
              value: state
            }, {
              name: "saveState",
              value: saveState
            }, {
              name: "metadata",
              value: metadata
            }, {
              name: "saveMetadata",
              value: saveMetadata
            }, {
              name: "deleteMetadata",
              value: deleteMetadata
            }, {
              name: "clearAllMetadata",
              value: clearAllMetadata
            }, {
              name: "tags",
              value: tags
            }, {
              name: "getTagValue",
              value: getTagValue
            }, {
              name: "setTagValue",
              value: setTagValue
            }];

          console.log("Context fields", contextFields);
          
          return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      background: "#f8f9fa"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 10px 0",
      fontSize: "16px",
      color: "#333"
    }
  }, "\uD83D\uDEE0\uFE0F Custom Debug Context Status"), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "13px"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: "#f1f3f4"
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "6px",
      border: "1px solid #ddd"
    }
  }, "Context Field"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "6px",
      border: "1px solid #ddd"
    }
  }, "Available?"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "6px",
      border: "1px solid #ddd"
    }
  }, "Type/Status"))), /*#__PURE__*/React.createElement("tbody", null, contextFields.map(({
    name,
    value
  }) => /*#__PURE__*/React.createElement("tr", {
    key: name
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "6px",
      border: "1px solid #ddd",
      fontWeight: "bold"
    }
  }, name), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "6px",
      border: "1px solid #ddd",
      textAlign: "center"
    }
  }, value !== undefined && value !== null ? "good" : "bad"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "6px",
      border: "1px solid #ddd",
      color: "#666"
    }
  }, value === undefined ? "undefined" : value === null ? "null" : typeof value))))));
        }
      `;

export const MANAGEMENT_V2 = `
({
  // React dependencies (destructured from context)
  useState,
  // MST model item for data access
  item,
  // Region management
  regions,
  addRegion,
  deleteRegion,
  clearAllRegions,
  // Data management
  state,
  saveState,
  // Metadata management
  metadata,
  saveMetadata,
  deleteMetadata,
  clearAllMetadata,
  // Tag management API
  tags,
  getTagValue,
  setTagValue
}) => {
  // State for tag value editing
  const [tagEdits, setTagEdits] = useState({});
  const handleTagSet = tagName => {
    const value = tagEdits[tagName];
    if (value !== undefined && value !== "") {
      setTagValue(tagName, value);
      setTagEdits(prev => ({
        ...prev,
        [tagName]: ""
      })); // Clear input after setting
    }
  };

  // Wait for state to be loaded before rendering UI
  if (typeof state === "undefined" || state === null) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "20px",
        textAlign: "center",
        color: "#888"
      }
    }, /*#__PURE__*/React.createElement("span", null, "Loading data..."));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      backgroundColor: "#f8f9fa"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 15px 0",
      fontSize: "16px",
      color: "#333"
    }
  }, "\uD83C\uDFAF Custom Interface Management"), typeof item !== "undefined" && item?.loadedData && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "bold",
      color: "#007bff",
      marginBottom: "4px"
    }
  }, "Loaded item.loadedData:"), /*#__PURE__*/React.createElement("pre", {
    style: {
      background: "#f4f4f4",
      border: "1px solid #ddd",
      borderRadius: "3px",
      padding: "8px",
      fontSize: "12px",
      maxHeight: "120px",
      overflow: "auto"
    }
  }, JSON.stringify(item.loadedData, null, 2))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const regionData = prompt("Enter region data (JSON format):", '{"x": 100, "y": 100}');
      if (regionData) {
        try {
          const parsedData = JSON.parse(regionData);
          addRegion(parsedData);
          console.log("Region added:", parsedData);
        } catch (e) {
          alert("Invalid JSON format. Please enter valid JSON.");
        }
      }
    },
    style: {
      padding: "5px 10px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px"
    }
  }, "\u2795 Add Region"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      if (regions && regions.length > 0) {
        if (confirm(\`Are you sure you want to delete all \${regions.length} regions?\`)) {
          clearAllRegions();
        }
      }
    },
    style: {
      padding: "5px 10px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px"
    }
  }, "\uD83D\uDDD1\uFE0F Clear All")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "5px"
    }
  }, "\uD83D\uDCCD Regions (", regions?.length || 0, ")"), /*#__PURE__*/React.createElement("details", {
    style: {
      marginBottom: "5px"
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      fontSize: "11px",
      color: "#666"
    }
  }, regions?.length ? \`View \${regions.length} regions\` : "No regions"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: "150px",
      overflowY: "auto",
      marginTop: "5px"
    }
  }, regions?.map((region, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "5px 10px",
      marginBottom: "3px",
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "3px",
      fontSize: "11px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace",
      flex: 1
    }
  }, JSON.stringify(region, null, 0)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => deleteRegion(region),
    style: {
      padding: "2px 5px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "2px",
      cursor: "pointer",
      fontSize: "9px",
      marginLeft: "5px"
    }
  }, "\u274C"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #e0e0e0"
    }
  }, /*#__PURE__*/React.createElement("h5", {
    style: {
      margin: "0 0 10px 0",
      fontSize: "14px",
      color: "#333"
    }
  }, "\uD83D\uDCBE Data Management"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const dataStr = prompt("Enter data (JSON format):", JSON.stringify(state || {}, null, 2));
      if (dataStr !== null) {
        try {
          const parsedData = JSON.parse(dataStr);
          saveState(parsedData);
          console.log("Data saved:", parsedData);
        } catch (e) {
          alert("Invalid JSON format. Please enter valid JSON.");
        }
      }
    },
    style: {
      padding: "5px 10px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px"
    }
  }, "\uD83D\uDCBE Save Data"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const currentData = JSON.stringify(state || {}, null, 2);
      navigator.clipboard.writeText(currentData).then(() => {
        alert("Data copied to clipboard!");
      }).catch(() => {
        alert(\`Current data:\n\${currentData}\`);
      });
    },
    style: {
      padding: "5px 10px",
      backgroundColor: "#17a2b8",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px"
    }
  }, "\uD83D\uDCCB Load Data")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "5px"
    }
  }, "\uD83D\uDCCA Current Data: ", Object.keys(state || {}).length, " keys"), state && Object.keys(state).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "5px",
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "3px",
      fontSize: "11px",
      fontFamily: "monospace",
      maxHeight: "80px",
      overflow: "auto"
    }
  }, JSON.stringify(state, null, 2))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #e0e0e0"
    }
  }, /*#__PURE__*/React.createElement("h5", {
    style: {
      margin: "0 0 10px 0",
      fontSize: "14px",
      color: "#333"
    }
  }, "\uD83C\uDFF7\uFE0F Metadata Management"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const action = prompt("Enter action type:", "user_action");
      const data = prompt("Enter metadata data (JSON format):", '{"note": "example"}');
      if (action && data) {
        try {
          const parsedData = JSON.parse(data);
          saveMetadata(action, parsedData);
          console.log("Metadata added:", {
            action,
            data: parsedData
          });
        } catch (e) {
          alert("Invalid JSON format for metadata data.");
        }
      }
    },
    style: {
      padding: "5px 10px",
      backgroundColor: "#6f42c1",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px"
    }
  }, "\u2795 Add Metadata"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      if (metadata && metadata.length > 0) {
        if (confirm(\`Are you sure you want to delete all \${metadata.length} metadata entries?\`)) {
          clearAllMetadata();
        }
      }
    },
    style: {
      padding: "5px 10px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px"
    }
  }, "\uD83D\uDDD1\uFE0F Clear All")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "5px"
    }
  }, "\uD83C\uDFF7\uFE0F Metadata Entries (", metadata?.length || 0, ")"), metadata && metadata.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: "120px",
      overflowY: "auto"
    }
  }, metadata.map((metadataItem, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "5px 8px",
      marginBottom: "3px",
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "3px",
      fontSize: "11px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "bold",
      color: "#6f42c1",
      marginBottom: "2px"
    }
  }, metadataItem.action), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "9px",
      color: "#999",
      marginBottom: "2px"
    }
  }, new Date(metadataItem.timestamp).toLocaleString()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "10px",
      fontFamily: "monospace"
    }
  }, JSON.stringify(metadataItem.data, null, 1))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => deleteMetadata(index),
    style: {
      padding: "2px 5px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "2px",
      cursor: "pointer",
      fontSize: "9px",
      marginLeft: "5px"
    }
  }, "\u274C"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "20px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 10px 0",
      fontSize: "16px",
      fontWeight: "bold"
    }
  }, "\uD83C\uDFF7\uFE0F Tag Management"), !tags || tags().length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#666",
      fontSize: "12px"
    }
  }, "No other tags available in this annotation.") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      backgroundColor: "#f8f9fa"
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "8px",
      border: "1px solid #ddd",
      fontWeight: "bold"
    }
  }, "Tag Name"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "8px",
      border: "1px solid #ddd",
      fontWeight: "bold"
    }
  }, "Type"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "8px",
      border: "1px solid #ddd",
      fontWeight: "bold"
    }
  }, "Current Value"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "8px",
      border: "1px solid #ddd",
      fontWeight: "bold"
    }
  }, "Set New Value"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "8px",
      border: "1px solid #ddd",
      fontWeight: "bold"
    }
  }, "Action"))), /*#__PURE__*/React.createElement("tbody", null, tags().map(tag => {
    const currentValue = getTagValue(tag.name);
    const isChoices = tag.type === "choices" && tag.options;
    return /*#__PURE__*/React.createElement("tr", {
      key: tag.name
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px",
        border: "1px solid #ddd",
        fontWeight: "bold"
      }
    }, tag.name), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px",
        border: "1px solid #ddd",
        color: "#666"
      }
    }, tag.type), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px",
        border: "1px solid #ddd",
        fontFamily: "monospace",
        fontSize: "10px"
      }
    }, /*#__PURE__*/React.createElement("pre", {
      style: {
        margin: 0,
        whiteSpace: "pre-wrap",
        maxWidth: "150px",
        overflow: "auto"
      }
    }, currentValue ? JSON.stringify(currentValue, null, 1) : "null")), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px",
        border: "1px solid #ddd"
      }
    }, isChoices ? /*#__PURE__*/React.createElement("select", {
      value: tagEdits[tag.name] ?? "",
      onChange: e => setTagEdits(prev => ({
        ...prev,
        [tag.name]: e.target.value
      })),
      style: {
        width: "120px",
        padding: "4px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        fontSize: "11px"
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "-- Select --"), tag.options.map(option => /*#__PURE__*/React.createElement("option", {
      key: option,
      value: option
    }, option))) : /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: tagEdits[tag.name] ?? "",
      onChange: e => setTagEdits(prev => ({
        ...prev,
        [tag.name]: e.target.value
      })),
      placeholder: "Enter value...",
      style: {
        width: "120px",
        padding: "4px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        fontSize: "11px"
      }
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px",
        border: "1px solid #ddd",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handleTagSet(tag.name),
      disabled: !tagEdits[tag.name],
      style: {
        padding: "4px 8px",
        backgroundColor: tagEdits[tag.name] ? "#28a745" : "#e9ecef",
        color: tagEdits[tag.name] ? "white" : "#6c757d",
        border: "none",
        borderRadius: "3px",
        fontSize: "10px",
        cursor: tagEdits[tag.name] ? "pointer" : "not-allowed"
      }
    }, "Set")));
  }))))));
}`;

export const POC_UI = `
({
  // React dependencies (from context)
  useState,
  useEffect,
  useMemo,
  // Component Data & State
  data,
  regions,
  state,
  metadata,
  // Actions
  addRegion,
  saveState,
  saveMetadata,
  getTagValue,
  setTagValue
}) => {
  // All style objects, helper functions, and sub-components are now defined inside the main component's closure.

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px"
  };
  const thStyle = {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
    textAlign: "left"
  };
  const tdStyle = {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ddd",
    padding: "8px"
  };
  const buttonStyle = {
    marginRight: "5px",
    padding: "5px 10px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "white"
  };
  const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    color: "white",
    borderColor: "#4CAF50"
  };
  const selectedBadButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336",
    // Red color
    color: "white",
    borderColor: "#f44336"
  };
  const textareaStyle = {
    width: "100%",
    padding: "5px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: "4px",
    minHeight: "40px",
    resize: "vertical"
  };

  // A simple, dependency-free CSV parser.
  const simpleCSVParser = csvText => {
    if (!csvText || typeof csvText !== "string") {
      return {
        headers: [],
        rows: []
      };
    }
    const lines = csvText.trim().split(/\\r?\\n/);
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {});
    });
    return {
      headers,
      rows
    };
  };

  // A single star component
  const Star = ({
    selected,
    onSelect
  }) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSelect,
    style: {
      cursor: "pointer",
      color: selected ? "gold" : "grey",
      fontSize: "20px",
      background: "none",
      border: "none",
      padding: 0,
      margin: 0
    }
  }, "\u2605");

  // The component that groups stars together
  const StarRating = ({
    totalStars = 5,
    rating = 0,
    onRate
  }) => {
    return /*#__PURE__*/React.createElement("div", null, [...Array(totalStars)].map((_, i) => /*#__PURE__*/React.createElement(Star, {
      key: i,
      selected: i < rating,
      onSelect: () => onRate(i + 1)
    })));
  };

  // New component for the two questions
  const QuestionUI = ({
    getTagValue,
    setTagValue
  }) => {
    // The names of the <Choices> tags in your LS config
    const tagAB = "choice1";
    const tagXY = "choice2";

    // Get the current values directly on every render.
    const choiceAB = getTagValue(tagAB)?.choices[0];
    const choiceXY = getTagValue(tagXY)?.choices[0];
    const handleSelect = (tag, value) => {
      const currentVal = getTagValue(tag)?.[0];
      const newValue = currentVal === value ? null : value;
      setTagValue(tag, newValue);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "20px",
        padding: "10px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#eee",
        borderRadius: "4px"
      }
    }, /*#__PURE__*/React.createElement("h4", null, "Quick Questions"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "10px"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "0 0 5px 0"
      }
    }, "1. Is it an 'A' or a 'B'?"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: choiceAB === "A" ? selectedButtonStyle : buttonStyle,
      onClick: () => handleSelect(tagAB, "A")
    }, "A"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: choiceAB === "B" ? selectedButtonStyle : buttonStyle,
      onClick: () => handleSelect(tagAB, "B")
    }, "B")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "0 0 5px 0"
      }
    }, "2. Is it an 'X' or a 'Y'?"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: choiceXY === "X" ? selectedButtonStyle : buttonStyle,
      onClick: () => handleSelect(tagXY, "X")
    }, "X"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: choiceXY === "Y" ? selectedButtonStyle : buttonStyle,
      onClick: () => handleSelect(tagXY, "Y")
    }, "Y")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "11px",
        color: "#888",
        marginTop: "10px"
      }
    }, "This updates Choices tags named '", /*#__PURE__*/React.createElement("code", null, tagAB), "' and '", /*#__PURE__*/React.createElement("code", null, tagXY), "'."));
  };
  const [tableData, setTableData] = useState({
    headers: [],
    rows: []
  });
  const [classifications, setClassifications] = useState({});
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({}); // New state for star ratings

  // Effect to parse CSV data when the component loads or data changes
  useEffect(() => {
    if (typeof data === "string" && data) {
      const results = simpleCSVParser(data);
      setTableData({
        headers: results.headers,
        rows: results.rows
      });
    }
  }, [data]);

  // Effect to hydrate component state from saved annotation data
  useEffect(() => {
    // Hydrate classifications from regions
    const initialClassifications = {};
    regions.forEach(region => {
      const {
        rowId,
        classification
      } = region._value;
      if (rowId !== undefined) {
        initialClassifications[rowId] = classification;
      }
    });
    setClassifications(initialClassifications);

    // Hydrate comments from global state
    if (state?.comments) {
      setComments(state.comments);
    }

    // Hydrate ratings from metadata
    if (metadata) {
      const latestRatings = {};
      metadata.forEach(entry => {
        if (entry.action === "RATING_SET" && entry.data?.rowId !== undefined) {
          // The last entry in the metadata log for a given row wins
          latestRatings[entry.data.rowId] = entry.data.rating;
        }
      });
      setRatings(latestRatings);
    }
  }, [regions, state, metadata]);

  // Memoize the unique row identifier.
  const getRowId = useMemo(() => {
    return (row, index) => index;
  }, []);
  const handleClassify = (row, index, classification) => {
    const rowId = getRowId(row, index);
    setClassifications(prev => ({
      ...prev,
      [rowId]: classification
    }));

    // Find if a region for this row already exists
    const existingRegion = regions.find(r => r._value.rowId === rowId);
    const regionData = {
      rowId,
      classification,
      rowData: row
    };
    if (existingRegion) {
      // If the region for this row already exists, just update its value
      // using the new, sanctioned action on the region model.
      existingRegion.updateValue(regionData);
    } else {
      // If this is the first time classifying this row, create a new region.
      addRegion(regionData);
    }
  };
  const handleCommentChange = (row, index, text) => {
    const rowId = getRowId(row, index);
    setComments(prev => ({
      ...prev,
      [rowId]: text
    }));
  };
  const handleCommentBlur = (row, index) => {
    const rowId = getRowId(row, index);
    const commentText = comments[rowId] || "";
    const newComments = {
      ...state.comments
    };
    if (commentText) {
      newComments[rowId] = commentText;
    } else {
      delete newComments[rowId];
    }
    saveState({
      comments: newComments
    });
  };

  // New handler for saving star ratings
  const handleRate = (row, index, rating) => {
    const rowId = getRowId(row, index);

    // If the user clicks the same star value again, toggle it off (rate 0)
    const newRating = ratings[rowId] === rating ? 0 : rating;
    setRatings(prev => ({
      ...prev,
      [rowId]: newRating
    }));

    // Use the saveMetadata function to log the action
    saveMetadata("RATING_SET", {
      rowId,
      rating: newRating
    });
  };
  if (!data || tableData.headers.length === 0 && tableData.rows.length === 0) {
    return /*#__PURE__*/React.createElement("div", null, "No CSV data to display or data is still loading.");
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(QuestionUI, {
    getTagValue: getTagValue,
    setTagValue: setTagValue
  }), /*#__PURE__*/React.createElement("h4", null, "POC Data Classification"), /*#__PURE__*/React.createElement("table", {
    style: tableStyle
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, tableData.headers.map(header => /*#__PURE__*/React.createElement("th", {
    key: header,
    style: thStyle
  }, header)), /*#__PURE__*/React.createElement("th", {
    style: thStyle
  }, "Classification"), /*#__PURE__*/React.createElement("th", {
    style: thStyle
  }, "Comments"), /*#__PURE__*/React.createElement("th", {
    style: thStyle
  }, "Rating"))), /*#__PURE__*/React.createElement("tbody", null, tableData.rows.map((row, index) => {
    const rowId = getRowId(row, index);
    const selectedClass = classifications[rowId];
    return /*#__PURE__*/React.createElement("tr", {
      key: rowId
    }, tableData.headers.map(header => /*#__PURE__*/React.createElement("td", {
      key: \`\${rowId}-\${header}\`,
      style: tdStyle
    }, row[header])), /*#__PURE__*/React.createElement("td", {
      style: tdStyle
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: selectedClass === "Good" ? selectedButtonStyle : buttonStyle,
      onClick: () => handleClassify(row, index, "Good")
    }, "Good"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: selectedClass === "Bad" ? selectedBadButtonStyle : buttonStyle,
      onClick: () => handleClassify(row, index, "Bad")
    }, "Bad")), /*#__PURE__*/React.createElement("td", {
      style: tdStyle
    }, /*#__PURE__*/React.createElement("textarea", {
      style: textareaStyle,
      value: comments[rowId] || "",
      onChange: e => handleCommentChange(row, index, e.target.value),
      onBlur: () => handleCommentBlur(row, index),
      placeholder: "Add a comment..."
    })), /*#__PURE__*/React.createElement("td", {
      style: tdStyle
    }, /*#__PURE__*/React.createElement(StarRating, {
      rating: ratings[rowId] || 0,
      onRate: newRating => handleRate(row, index, newRating)
    })));
  }))));
}`;
