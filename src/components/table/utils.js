import React from "react"
import { unmountComponentAtNode, render } from "react-dom"
import "./table.scss"

export function mountTableActionsMenu(position, actionItems, mountConfirmationModal) {
  const style = {
    position: "absolute",
    top: position.top + 10,
    left: position.left - 160
  }
  console.log("action", actionItems)
  const ActionMenu = (
    <div style={style} className="table--action-menu">
      <div className="menu-item" onClick={() => mountConfirmationModal("deleteUser")}> {actionItems[0]} </div>
      <div className="menu-item" onClick={() => mountConfirmationModal("deactivateUser")}> {actionItems[1]} </div>
    </div>
  )
  render(ActionMenu, document.getElementById("fixed--position-el"))
}

export function unmountTableActionsMenu(e) {
  if (e.target.parentNode.className !== "table--action-menu") {
    unmountComponentAtNode(document.getElementById("fixed--position-el"))
  }
}