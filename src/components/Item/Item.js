import React, {Component, PropTypes} from 'react'
import {connect} from 'dva'
import RnD from 'react-rnd'
import classNames from 'classnames'
import items from '../../data/items'
import styles from './Item.less'

const Item = props => {

  let chart = null

  const {
    item:{
      id, x, y, width, height, type, style, eventList, // 基础属性
    },
    list,
    isEdit,
    activeItemId,
    hoverItemId,
    dragItem,
    dispatch,
    children,
    className,
    autoResize,
  } = props

  const {clientWidth: listWidth} = document.getElementById('list') || {}
  const ratio = autoResize && listWidth ? listWidth / 1080 : 1
  // const realWidth = isNaN(width) ? width : width * ratio
  // const realHeight = isNaN(height) ? height : height * ratio
  // const realX = x * ratio
  // const realY = y * ratio

  //开始拖拽控件
  const onDragStart = (e) => {
    e.stopPropagation()
    dispatch({
      type: 'item/setDragItem',
      payload: {
        ...props.item,
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      }
    })
  }

  //停止拖拽控件
  const onDragStop = (e, d) => {
    let {x, y} = d
    // x = x / ratio
    // y = y / ratio
    x = x < 0 ? 0 : x
    y = y < 0 ? 0 : y
    dispatch({
      type: 'item/setDragItem',
      payload: {
        ...props.item,
        offsetX: dragItem.offsetX,
        offsetY: dragItem.offsetY,
        x,
        y,
      }
    })
    setTimeout(() => {
      dispatch({
        type: 'item/setDragItem',
        payload: {}
      })
      dispatch({
        type: 'item/setHoverItemId',
        payload: ''
      })
    }, 100)
  }

  //调整控件大小时
  const onResize = (e, direction, ref, d, position) => {
    let {x, y} = position
    // x = x / ratio
    // y = y / ratio
    x = x < 0 ? 0 : x
    y = y < 0 ? 0 : y
    dispatch({
      type: 'item/setItem',
      payload: {
        id,
        x,
        y,
      }
    })
  }

  //停止调整控件大小
  const onResizeStop = (e, direction, ref, d) => {
    dispatch({
      type: 'item/setItem',
      payload: {
        id,
        width: width + d.width,
        height: height + d.height,
      }
    })
    chart.resize && chart.resize()
  }

  //鼠标移至控件上时
  const onMouseOver = e => {
    e.stopPropagation()
    if (isEdit) {
      if (dragItem.id && type === 'container') {
        dispatch({
          type: 'item/setHoverItemId',
          payload: id
        })
      }
    }
  }

  //控件事件
  const onEvent = e => {
    e.stopPropagation()
    if (!isEdit) {
      eventList.map(event => {
        if (event.type === e.type) {
          let targetItem = list.find(item => item.id === event.targetId)
          if (targetItem) {
            switch (event.action) {
              case 'refresh':
                targetItem.conditionList = event.conditionList
                targetItem.refreshTime = new Date()
                break
              case 'hide':
                targetItem.style.visibility = 'hidden'
                break
              case 'show':
                targetItem.style.visibility = 'visible'
                break
              case 'setData':
                break
            }
            dispatch({
              type: 'item/setItem',
              payload: {...targetItem}
            })
          }
        }
      })
    }
  }

  const onMouseDown = e => {
    e.stopPropagation()
    dispatch({
      type: 'item/setActiveItemId',
      payload: id,
    })
  }

  //获取控件内容
  const getContent = (type) => {
    const Content = items[type].instance
    return <Content item={props.item} ref={instance => {
      if (!chart) chart = instance
    }}>{children}</Content>
  }

  return (activeItemId === id) && isEdit ? <RnD
      className={classNames(
        styles.rnd,
        {
          [styles.noneEvents]: dragItem.id === id,
        },
        className
      )}
      style={style}
      position={{x: x, y: y}}
      size={{width: width, height: height}}
      z={((dragItem.id === id) || (activeItemId === id)) ? 999 : ''}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResize={onResize}
      onResizeStop={onResizeStop}
      resizeHandleWrapperClass={styles.resizeHandle}
      extendsProps={{id}}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      {getContent(type)}
    </RnD> :
    <div className={classNames(
      styles.item,
      {
        [styles.noneEvents]: dragItem.id && type !== 'container',
        [styles.hover]: hoverItemId === id,
      },
      className
    )}
         id={id}
         style={{...style, width: width, height: height, left: x, top: y}}
         onMouseOver={onMouseOver}
         onClick={onEvent}
         onDoubleClick={onEvent}
         onMouseDown={onMouseDown}
    >
      {getContent(type)}
    </div>
}

function mapStateToProps(state) {
  const {
    list,
    activeItemId,
    hoverItemId,
    dragItem,
    autoResize,
  } = state.item;
  return {
    list,
    activeItemId,
    hoverItemId,
    dragItem,
    autoResize,
  };
}

export default connect(mapStateToProps)(Item)
