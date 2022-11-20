interface iconProps {
    iconName: string; // icon-font 名字
    customClassName?: string; // i 标签样式
    onIconClick?: () => void; // i 点击事件
}

const Icon = (props: iconProps) => {

    const { iconName, customClassName, onIconClick } = props

    const handleIcon = () => onIconClick?.()
    return (
        <i className={`iconfont ${iconName} ${customClassName}`} onClick={handleIcon}></i>
    )
}

export default Icon