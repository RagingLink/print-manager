
import { Static, Type } from '@sinclair/typebox';

export const PowerRouteBodySchema = Type.Object({
        mode: Type.Union([
            Type.Literal('on'),
            Type.Literal('off'),
            Type.Literal('toggle')
        ], {
            errorMessage: 'Mode must be one of \'on\' | \'off\' \'toggle\''
        })
    });

export type PowerModeBodyType = Static<typeof PowerRouteBodySchema>;