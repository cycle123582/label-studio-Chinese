/**
 * A standard React component for the unified management UI.
 * It receives all context and functionality as props.
 */
export const ManagementUI = ({
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
  setTagValue,
}) => {
  // State for tag value editing
  const [tagEdits, setTagEdits] = useState({});

  const handleTagSet = (tagName) => {
    const value = tagEdits[tagName];
    if (value !== undefined && value !== "") {
      setTagValue(tagName, value);
      setTagEdits((prev) => ({ ...prev, [tagName]: "" })); // Clear input after setting
    }
  };

  // Wait for state to be loaded before rendering UI
  if (typeof state === "undefined" || state === null) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        <span>Loading data...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "10px",
        marginBottom: "10px",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h4 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#333" }}>🎯 Custom Interface Management</h4>

      {/* Loaded item.loadedData Section */}
      {typeof item !== "undefined" && item?.loadedData && (
        <div style={{ marginBottom: "15px" }}>
          <div style={{ fontWeight: "bold", color: "#007bff", marginBottom: "4px" }}>Loaded item.loadedData:</div>
          <pre
            style={{
              background: "#f4f4f4",
              border: "1px solid #ddd",
              borderRadius: "3px",
              padding: "8px",
              fontSize: "12px",
              maxHeight: "120px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(item.loadedData, null, 2)}
          </pre>
        </div>
      )}

      {/* Region Management Section */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button
          type="button"
          onClick={() => {
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
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ➕ Add Region
        </button>

        <button
          type="button"
          onClick={() => {
            if (regions && regions.length > 0) {
              if (confirm(`Are you sure you want to delete all ${regions.length} regions?`)) {
                clearAllRegions();
              }
            }
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          🗑️ Clear All
        </button>
      </div>

      <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>📍 Regions ({regions?.length || 0})</div>

      <details style={{ marginBottom: "5px" }}>
        <summary style={{ cursor: "pointer", fontSize: "11px", color: "#666" }}>
          {regions?.length ? `View ${regions.length} regions` : "No regions"}
        </summary>
        <div style={{ maxHeight: "150px", overflowY: "auto", marginTop: "5px" }}>
          {regions?.map((region, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 10px",
                marginBottom: "3px",
                backgroundColor: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              <span style={{ fontFamily: "monospace", flex: 1 }}>{JSON.stringify(region, null, 0)}</span>
              <button
                type="button"
                onClick={() => deleteRegion(region)}
                style={{
                  padding: "2px 5px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "9px",
                  marginLeft: "5px",
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </details>

      {/* Data Management Section */}
      <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e0e0e0" }}>
        <h5 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#333" }}>💾 Data Management</h5>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            type="button"
            onClick={() => {
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
            }}
            style={{
              padding: "5px 10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            💾 Save Data
          </button>

          <button
            type="button"
            onClick={() => {
              const currentData = JSON.stringify(state || {}, null, 2);
              navigator.clipboard
                .writeText(currentData)
                .then(() => {
                  alert("Data copied to clipboard!");
                })
                .catch(() => {
                  alert(`Current data:\n${currentData}`);
                });
            }}
            style={{
              padding: "5px 10px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            📋 Load Data
          </button>
        </div>

        <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
          📊 Current Data: {Object.keys(state || {}).length} keys
        </div>

        {state && Object.keys(state).length > 0 && (
          <div
            style={{
              padding: "5px",
              backgroundColor: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: "3px",
              fontSize: "11px",
              fontFamily: "monospace",
              maxHeight: "80px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(state, null, 2)}
          </div>
        )}
      </div>

      {/* Metadata Management Section */}
      <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e0e0e0" }}>
        <h5 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#333" }}>🏷️ Metadata Management</h5>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            type="button"
            onClick={() => {
              const action = prompt("Enter action type:", "user_action");
              const data = prompt("Enter metadata data (JSON format):", '{"note": "example"}');

              if (action && data) {
                try {
                  const parsedData = JSON.parse(data);
                  saveMetadata(action, parsedData);
                  console.log("Metadata added:", { action, data: parsedData });
                } catch (e) {
                  alert("Invalid JSON format for metadata data.");
                }
              }
            }}
            style={{
              padding: "5px 10px",
              backgroundColor: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            ➕ Add Metadata
          </button>

          <button
            type="button"
            onClick={() => {
              if (metadata && metadata.length > 0) {
                if (confirm(`Are you sure you want to delete all ${metadata.length} metadata entries?`)) {
                  clearAllMetadata();
                }
              }
            }}
            style={{
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            🗑️ Clear All
          </button>
        </div>

        <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
          🏷️ Metadata Entries ({metadata?.length || 0})
        </div>

        {metadata && metadata.length > 0 && (
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {metadata.map((metadataItem, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "5px 8px",
                  marginBottom: "3px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "3px",
                  fontSize: "11px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", color: "#6f42c1", marginBottom: "2px" }}>{metadataItem.action}</div>
                  <div style={{ fontSize: "9px", color: "#999", marginBottom: "2px" }}>
                    {new Date(metadataItem.timestamp).toLocaleString()}
                  </div>
                  <div style={{ fontSize: "10px", fontFamily: "monospace" }}>
                    {JSON.stringify(metadataItem.data, null, 1)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMetadata(index)}
                  style={{
                    padding: "2px 5px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "9px",
                    marginLeft: "5px",
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tag Management Section */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "bold" }}>🏷️ Tag Management</h3>
        {!tags || tags().length === 0 ? (
          <p style={{ color: "#666", fontSize: "12px" }}>No other tags available in this annotation.</p>
        ) : (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ textAlign: "left", padding: "8px", border: "1px solid #ddd", fontWeight: "bold" }}>
                    Tag Name
                  </th>
                  <th style={{ textAlign: "left", padding: "8px", border: "1px solid #ddd", fontWeight: "bold" }}>
                    Type
                  </th>
                  <th style={{ textAlign: "left", padding: "8px", border: "1px solid #ddd", fontWeight: "bold" }}>
                    Current Value
                  </th>
                  <th style={{ textAlign: "left", padding: "8px", border: "1px solid #ddd", fontWeight: "bold" }}>
                    Set New Value
                  </th>
                  <th style={{ textAlign: "center", padding: "8px", border: "1px solid #ddd", fontWeight: "bold" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tags().map((tag) => {
                  const currentValue = getTagValue(tag.name);
                  const isChoices = tag.type === "choices" && tag.options;

                  return (
                    <tr key={tag.name}>
                      <td style={{ padding: "8px", border: "1px solid #ddd", fontWeight: "bold" }}>{tag.name}</td>
                      <td style={{ padding: "8px", border: "1px solid #ddd", color: "#666" }}>{tag.type}</td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #ddd",
                          fontFamily: "monospace",
                          fontSize: "10px",
                        }}
                      >
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap", maxWidth: "150px", overflow: "auto" }}>
                          {currentValue ? JSON.stringify(currentValue, null, 1) : "null"}
                        </pre>
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {isChoices ? (
                          <select
                            value={tagEdits[tag.name] ?? ""}
                            onChange={(e) => setTagEdits((prev) => ({ ...prev, [tag.name]: e.target.value }))}
                            style={{
                              width: "120px",
                              padding: "4px",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              fontSize: "11px",
                            }}
                          >
                            <option value="">-- Select --</option>
                            {tag.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={tagEdits[tag.name] ?? ""}
                            onChange={(e) => setTagEdits((prev) => ({ ...prev, [tag.name]: e.target.value }))}
                            placeholder="Enter value..."
                            style={{
                              width: "120px",
                              padding: "4px",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              fontSize: "11px",
                            }}
                          />
                        )}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleTagSet(tag.name)}
                          disabled={!tagEdits[tag.name]}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: tagEdits[tag.name] ? "#28a745" : "#e9ecef",
                            color: tagEdits[tag.name] ? "white" : "#6c757d",
                            border: "none",
                            borderRadius: "3px",
                            fontSize: "10px",
                            cursor: tagEdits[tag.name] ? "pointer" : "not-allowed",
                          }}
                        >
                          Set
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
