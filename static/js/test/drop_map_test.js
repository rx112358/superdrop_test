import {expect, jest, test} from '@jest/globals';

import { create_draggable_marker, create_marker } from "../drop_map";

test(' marker created successfully',()=>{
    expect(create_marker().getLatLng()).not.toBe(undefined)
})

test(' marker created successfully',()=>{
    expect(create_icon()).not.toBe(undefined)
})

test(' draggable marker created successfully',()=>{
    expect(create_draggable_marker().getLatLng()).not.toBe(undefined)
})