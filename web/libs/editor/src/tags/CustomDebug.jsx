// CustomDebug.jsx
// Debug utility to check if all required context fields are available
// Usage: Pass the same context as CustomManagement.jsx

export const createCustomDebug = ({
  React,
  useState,
  regions,
  addRegion,
  deleteRegion,
  clearAllRegions,
  data,
  saveData,
  metadata,
  saveMetadata,
  deleteMetadata,
  clearAllMetadata,
  tags,
  getTagValue,
  setTagValue,
}) => {
  // List of context fields to check
  const contextFields = [
    { name: "React", value: React },
    { name: "useState", value: useState },
    { name: "regions", value: regions },
    { name: "addRegion", value: addRegion },
    { name: "deleteRegion", value: deleteRegion },
    { name: "clearAllRegions", value: clearAllRegions },
    { name: "data", value: data },
    { name: "saveData", value: saveData },
    { name: "metadata", value: metadata },
    { name: "saveMetadata", value: saveMetadata },
    { name: "deleteMetadata", value: deleteMetadata },
    { name: "clearAllMetadata", value: clearAllMetadata },
    { name: "tags", value: tags },
    { name: "getTagValue", value: getTagValue },
    { name: "setTagValue", value: setTagValue },
  ];

  return () => (
    <div style={{ padding: "10px", border: "1px solid #e0e0e0", borderRadius: "4px", background: "#f8f9fa" }}>
      <h4 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#333" }}>🛠️ Custom Debug Context Status</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ background: "#f1f3f4" }}>
            <th style={{ textAlign: "left", padding: "6px", border: "1px solid #ddd" }}>Context Field</th>
            <th style={{ textAlign: "center", padding: "6px", border: "1px solid #ddd" }}>Available?</th>
            <th style={{ textAlign: "left", padding: "6px", border: "1px solid #ddd" }}>Type/Status</th>
          </tr>
        </thead>
        <tbody>
          {contextFields.map(({ name, value }) => (
            <tr key={name}>
              <td style={{ padding: "6px", border: "1px solid #ddd", fontWeight: "bold" }}>{name}</td>
              <td style={{ padding: "6px", border: "1px solid #ddd", textAlign: "center" }}>
                {value !== undefined && value !== null ? "✅" : "❌"}
              </td>
              <td style={{ padding: "6px", border: "1px solid #ddd", color: "#666" }}>
                {value === undefined ? "undefined" : value === null ? "null" : typeof value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default createCustomDebug;
