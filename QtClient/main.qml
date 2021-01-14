import QtQuick 2.12
import QtQuick.Window 2.12
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.12

Window {
    width: 640
    height: 480
    visible: true
    title: qsTr("Hello World")
    RowLayout {
        id: inputBar
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: 30
        Rectangle {
            id: urlLabel
            Layout.fillHeight: true
            Layout.preferredWidth: 120
            color: "azure"
            Text {
                id: urlLabelText
                anchors.fill: parent
                font.pixelSize: 20
                text: "Player Name:"
            }
        }
        Rectangle {
            id: urlTextInputBox
            Layout.fillHeight: true
            Layout.fillWidth: true
            color: "lightgray"
            TextInput {
                anchors.fill: parent
                anchors.leftMargin: 10
                id: urlTextInput
                font.pixelSize: 20
            }
        }
        Button {
            id: requestButton
            objectName: "requestButton"
            Layout.fillHeight: true
            Layout.preferredWidth: 120
            font.pixelSize: 20
            text: "Join Game"

            signal requestPressed(string msg)
            onClicked: requestButton.requestPressed(urlTextInput.text)
        }
    }
}
