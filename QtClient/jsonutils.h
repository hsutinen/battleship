#ifndef JSONUTILS_H
#define JSONUTILS_H
#include <QJsonObject>

class JsonUtils
{
public:
    static bool tryGetStringProperty(QJsonObject &obj, const QString &property, QString &string);
private:
    JsonUtils();
};

#endif // JSONUTILS_H
