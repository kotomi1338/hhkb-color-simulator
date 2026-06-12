<?php

namespace App\Models;

use Database\Factories\DesignFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Design extends Model
{
    /** @use HasFactory<DesignFactory> */
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'layout_type',
        'colors',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'colors' => 'array',
        ];
    }

    /**
     * Get the presentation slide for this design.
     *
     * @return HasOne<PresentationSlide, $this>
     */
    public function presentationSlide(): HasOne
    {
        return $this->hasOne(PresentationSlide::class);
    }
}
