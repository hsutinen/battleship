#include "jsonutils.h"

JsonUtils::JsonUtils()
{

}

bool JsonUtils::tryGetStringProperty(QJsonObject &obj, const QString &property, QString &value)
{
    if (!obj.contains(property) || !obj[property].isString())
        return false;
    value = obj[property].toString();
    return true;
}
