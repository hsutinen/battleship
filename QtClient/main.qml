import QtQuick 2.12
import QtQuick.Window 2.12
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.12

ApplicationWindow {
    width: 640
    height: 480
    visible: true
    title: qsTr("Battleship")
    id: mainWindow

    StackView {
        width: mainWindow.width
        height: mainWindow.height
        id: contentFrame
        initialItem: Qt.resolvedUrl("join-game.qml")
    }
}
